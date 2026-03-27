import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirs = [
  'src/pages',
  'src/pages/public',
  'src/pages/app',
  'src/pages/admin',
  'src/layouts',
  'src/components/ui'
];
dirs.forEach(d => fs.mkdirSync(path.join(__dirname, d), { recursive: true }));

const pages = {
  'src/pages/public/SignUp.jsx': 'SignUp',
  'src/pages/public/SignIn.jsx': 'SignIn',
  'src/pages/public/ForgotPassword.jsx': 'ForgotPassword',
  'src/pages/public/AuthCallback.jsx': 'AuthCallback',
  'src/pages/app/UserDashboard.jsx': 'UserDashboard',
  'src/pages/app/Prospecting.jsx': 'Prospecting',
  'src/pages/app/Pipeline.jsx': 'Pipeline',
  'src/pages/app/Retention.jsx': 'Retention',
  'src/pages/app/Battlecards.jsx': 'Battlecards',
  'src/pages/app/Outbox.jsx': 'Outbox',
  'src/pages/app/Settings.jsx': 'Settings',
  'src/pages/admin/AdminDashboard.jsx': 'AdminDashboard',
  'src/pages/admin/Users.jsx': 'Users',
  'src/pages/admin/AgentActivity.jsx': 'AgentActivity',
  'src/pages/admin/DataSources.jsx': 'DataSources'
};

const layouts = {
  'src/layouts/UserLayout.jsx': 'import React from "react";\nimport { Outlet } from "react-router-dom";\n\nexport default function UserLayout() {\n  return (\n    <div className="user-layout flex min-h-screen bg-slate-50">\n      {/* Sidebar will go here */}\n      <main className="flex-1 ml-64">\n        <Outlet />\n      </main>\n    </div>\n  );\n}',
  'src/layouts/AdminLayout.jsx': 'import React from "react";\nimport { Outlet } from "react-router-dom";\n\nexport default function AdminLayout() {\n  return (\n    <div className="admin-layout flex min-h-screen bg-slate-100">\n      {/* Admin Sidebar will go here */}\n      <main className="flex-1 ml-64">\n        <Outlet />\n      </main>\n    </div>\n  );\n}'
};

Object.entries(pages).forEach(([f, name]) => {
  fs.writeFileSync(path.join(__dirname, f), `import React from 'react';\n\nexport default function ${name}() {\n  return (\n    <div className="p-8">\n      <h1 className="text-2xl font-semibold mb-4">${name} View</h1>\n      <p className="text-slate-500">This page is under construction.</p>\n    </div>\n  );\n}`);
});

Object.entries(layouts).forEach(([f, content]) => {
  fs.writeFileSync(path.join(__dirname, f), content);
});

console.log('Scaffolded React components correctly!');
