'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Download, Save } from 'lucide-react';
import html2canvas from 'html2canvas';

type CountryType = 'France' | 'Brazil' | 'Other';
type SelectedDatesType = { [key: string]: CountryType };
type CountsType = { [K in CountryType]: number };

const STORAGE_KEY = 'residencyCalendarDates';

const ResidencyCalendar = () => {
  const [selectedDates, setSelectedDates] = useState<SelectedDatesType>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const LOCALE = 'en-US';

  // Add new function to fetch latest config
  const fetchLatestConfig = async () => {
    try {
      // Get list of files in saved-configs directory
      const response = await fetch('https://api.github.com/repos/vinicius-saraiva/residency-planner/contents/saved-configs');
      if (!response.ok) throw new Error('Failed to fetch configs');
      
      const files = await response.json();
      
      // Sort files by name (which includes timestamp) to get the latest
      const sortedFiles = files.sort((a: any, b: any) => b.name.localeCompare(a.name));
      const latestFile = sortedFiles[0];
      
      if (latestFile) {
        // Fetch the content of the latest file
        const contentResponse = await fetch(latestFile.download_url);
        if (!contentResponse.ok) throw new Error('Failed to fetch config content');
        
        const configData = await contentResponse.json();
        
        // Update state and localStorage
        setSelectedDates(configData.selectedDates);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(configData.selectedDates));
      }
    } catch (error) {
      console.error('Error fetching latest config:', error);
      // Fall back to localStorage if available
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSelectedDates(JSON.parse(saved));
      }
    }
  };

  // Modify the initial useEffect to fetch from GitHub first
  useEffect(() => {
    fetchLatestConfig();
  }, []);

  // Keep the localStorage sync effect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedDates));
  }, [selectedDates]);

  const getDatesArray = (): Date[] => {
    const dates: Date[] = [];
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-12-31');
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const getDayCountByCountry = (): CountsType => {
    const counts: CountsType = {
      France: 0,
      Brazil: 0,
      Other: 0
    };
    
    Object.values(selectedDates).forEach(country => {
      counts[country] = (counts[country] || 0) + 1;
    });
    
    return counts;
  };

  const toggleDate = (date: Date): void => {
    const dateStr = formatDate(date);
    const currentCountry = selectedDates[dateStr] || 'Other';
    let nextCountry: CountryType;
    
    switch (currentCountry) {
      case 'Other':
        nextCountry = 'France';
        break;
      case 'France':
        nextCountry = 'Brazil';
        break;
      case 'Brazil':
        nextCountry = 'Other';
        break;
      default:
        nextCountry = 'Other';
    }
    
    const newDates = { ...selectedDates, [dateStr]: nextCountry };
    setSelectedDates(newDates);
  };

  const toggleMonth = (monthDates: Date[]): void => {
    const firstDateStr = formatDate(monthDates[0]);
    const currentCountry = selectedDates[firstDateStr] || 'Other';
    let nextCountry: CountryType;
    
    switch (currentCountry) {
      case 'Other':
        nextCountry = 'France';
        break;
      case 'France':
        nextCountry = 'Brazil';
        break;
      case 'Brazil':
        nextCountry = 'Other';
        break;
      default:
        nextCountry = 'Other';
    }
    
    const newDates = { ...selectedDates };
    monthDates.forEach(date => {
      newDates[formatDate(date)] = nextCountry;
    });
    setSelectedDates(newDates);
  };

  const getColorForCountry = (country: CountryType): string => {
    switch (country) {
      case 'France':
        return 'bg-blue-500';
      case 'Brazil':
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };

  const getTextColorForCountry = (country: CountryType): string => {
    switch (country) {
      case 'France':
      case 'Brazil':
        return 'text-white';
      default:
        return 'text-gray-700';
    }
  };

  const dates = getDatesArray();
  const counts = getDayCountByCountry();
  const isValid = counts.France >= 183;

  // Group dates by month
  const monthGroups: { [key: string]: Date[] } = dates.reduce((groups, date) => {
    const monthYear = date.toLocaleString(LOCALE, { month: 'long', year: 'numeric' });
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(date);
    return groups;
  }, {} as { [key: string]: Date[] });

  // Add download function
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById('residency-calendar');
      if (!element) return;
      
      const canvas = await html2canvas(element, {
        backgroundColor: 'white',
        scale: 2,
        useCORS: true,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement('style');
          style.innerHTML = `
            * {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            }
            .container {
              padding: 0 !important;
              margin: 0 !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.download = 'residency-calendar.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading calendar:', error);
    }
    setIsDownloading(false);
  };

  const handleSaveToCloud = async () => {
    setIsSaving(true);
    try {
      const data = {
        selectedDates,
        savedAt: new Date().toISOString(),
        version: '1.0.0'
      };

      const content = JSON.stringify(data, null, 2);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `calendar-config-${timestamp}.json`;

      const response = await fetch('https://api.github.com/repos/vinicius-saraiva/residency-planner/contents/saved-configs/' + filename, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Save calendar configuration - ${timestamp}`,
          content: btoa(content),
          branch: 'main'
        })
      });

      if (response.ok) {
        alert('Configuration saved successfully!');
        // Refresh the data after saving
        await fetchLatestConfig();
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving to cloud:', error);
      alert('Failed to save configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card 
      className="w-full max-w-6xl bg-white"
      id="residency-calendar"
      style={{ margin: 0 }}
    >
      <CardHeader className="flex flex-col space-y-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            2025 Residency Planner
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveToCloud}
              disabled={isSaving}
              className="flex items-center gap-2 px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save to Cloud'}
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? 'Downloading...' : 'Download PNG'}
            </button>
          </div>
        </CardTitle>
        <p className="text-sm text-gray-500">
          Note: You need 183 days in France to be considered a fiscal resident.
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>France: {counts.France} days</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Brazil: {counts.Brazil} days</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>Other: {counts.Other || 0} days</span>
          </div>
        </div>

        {!isValid && (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <AlertDescription>
              You need {183 - counts.France} more days in France to meet the residency requirement.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-3 gap-6">
          {Object.entries(monthGroups).map(([monthYear, monthDates]) => (
            <div key={monthYear} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{monthYear}</h3>
                <button
                  onClick={() => toggleMonth(monthDates)}
                  className="text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Select Month
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium p-1">
                    {day.charAt(0)}
                  </div>
                ))}
                
                {Array.from({ length: monthDates[0].getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-1"></div>
                ))}
                
                {monthDates.map(date => {
                  const dateStr = formatDate(date);
                  const country = selectedDates[dateStr] || 'Other';
                  const colorClass = getColorForCountry(country);
                  const textColorClass = getTextColorForCountry(country);
                  
                  return (
                    <button
                      key={date.getTime().toString()}
                      onClick={() => toggleDate(date)}
                      className={`p-1 rounded text-sm hover:opacity-80 transition-colors ${colorClass} ${textColorClass}`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResidencyCalendar;