# Residency Calendar Planner

A Next.js application to help track and plan residency days across different countries. This tool helps users manage their time between France, Brazil, and other countries while keeping track of residency requirements.

## Features

- Interactive calendar interface for the year 2025
- Track days spent in France, Brazil, and other countries
- Single-click date selection for individual days
- Bulk selection for entire months
- Automatic counting of days per country
- Residency requirement tracking (183 days for France)
- Fiscal residency status monitoring
- PNG export functionality
- Persistent storage using localStorage
- Responsive grid layout
- Color-coded countries for easy visualization:
  - France: Blue
  - Brazil: Green
  - Other: Gray

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 15.1.6
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**:
  - Shadcn UI components
  - Lucide React 0.473.0 for icons
- **Export**: html2canvas for PNG generation
- **State Management**: React useState + localStorage for persistence
- **Development Tools**:
  - ESLint for code linting
  - TurboPack for fast development builds


## Dependencies

```json
{
  "dependencies": {
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "html2canvas": "^1.4.1",
    "lucide-react": "^0.473.0",
    "next": "15.1.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

- Click on any date to cycle through countries:
  - First click: Sets to France (Blue)
  - Second click: Sets to Brazil (Green)
  - Third click: Sets to Other (Gray)
- Use the "Select Month" button to apply the same logic to entire months
- The top bar shows the total days count for each country
- An alert will show how many more days are needed in France to meet the 184-day requirement

## Project Structure

```
├── app/
│   └── page.tsx           # Main application page
├── components/
│   └── residency-calendar.tsx  # Calendar component
├── public/
│   └── ...               # Static assets
└── styles/
    └── ...              # Global styles and Tailwind config
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
