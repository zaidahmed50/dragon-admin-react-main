#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Unused page files to move
const unusedPages = [
    'home.jsx',
    'analytics.jsx',
    'reports-sales.jsx',
    'reports-leads.jsx',
    'reports-project.jsx',
    'reports-timesheets.jsx',
    'apps-chat.jsx',
    'apps-email.jsx',
    'apps-tasks.jsx',
    'apps-notes.jsx',
    'apps-calender.jsx',
    'apps-storage.jsx',
    'proposal-list.jsx',
    'proposal-view.jsx',
    'proposal-edit.jsx',
    'proposal-create.jsx',
    'payment-list.jsx',
    'payment-view.jsx',
    'payment-create.jsx',
    'leadsList.jsx',
    'leads-view.jsx',
    'leads-create.jsx',
    'projects-list.jsx',
    'projects-view.jsx',
    'projects-create.jsx',
    'settings-ganeral.jsx',
    'settings-seo.jsx',
    'settings-tags.jsx',
    'settings-email.jsx',
    'settings-tasks.jsx',
    'settings-leads.jsx',
    'settings-support.jsx',
    'settings-finance.jsx',
    'settings-gateways.jsx',
    'settings-customers.jsx',
    'settings-localization.jsx',
    'settings-recaptcha.jsx',
    'settings-miscellaneous.jsx',
    'widgets-lists.jsx',
    'widgets-tables.jsx',
    'widgets-charts.jsx',
    'widgets-statistics.jsx',
    'widgets-miscellaneous.jsx',
    // Authentication pages (extra variants)
    'login-minimal.jsx',
    'login-creative.jsx',
    'register-cover.jsx',
    'register-minimal.jsx',
    'register-creative.jsx',
    'reset-cover.jsx',
    'reset-minimal.jsx',
    'reset-creative.jsx',
    'error-cover.jsx',
    'error-minimal.jsx',
    'error-creative.jsx',
    'otp-cover.jsx',
    'otp-minimal.jsx',
    'otp-creative.jsx',
    'maintenance-cover.jsx',
    'maintenance-minimal.jsx',
    'maintenance-creative.jsx'
];

// Unused page directories to move
const unusedPageDirs = [
    'help-knowledgebase'
];

// Unused component directories to move
const unusedComponentDirs = [
    'chats',
    'emails', 
    'tasks',
    'notes',
    'calender',
    'storage',
    'proposal',
    'proposalEditCreate',
    'proposalView',
    'payment',
    'leads',
    'leadsViewCreate',
    'projectsList',
    'projectsCreate',
    'projectsView',
    'setting',
    'widgetsCharts',
    'widgetsList',
    'widgetsMiscellaneous',
    'widgetsStatistics',
    'widgetsTables'
];

// Unused component files
const unusedComponentFiles = [
    'authentication/LoginForm.jsx',
    'authentication/MaintenaceForm.jsx',
    'authentication/OtpVerifyForm.jsx',
    'authentication/RegisterForm.jsx',
    'authentication/ResetForm.jsx'
];

// Unused layout files
const unusedLayouts = [
    'layoutApplications.jsx',
    'layoutSetting.jsx'
];

const basePath = path.join(__dirname, 'src');
const extraCodePath = path.join(__dirname, 'extra-code');

// Create extra-code directory structure
function createExtraCodeDirs() {
    const dirs = [
        extraCodePath,
        path.join(extraCodePath, 'pages'),
        path.join(extraCodePath, 'components'),
        path.join(extraCodePath, 'layout')
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
}

// Move a file
function moveFile(sourcePath, destPath) {
    if (!fs.existsSync(sourcePath)) {
        console.log(`⚠️  File not found: ${sourcePath}`);
        return false;
    }

    try {
        // Create destination directory if it doesn't exist
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        // Copy file to destination
        fs.copyFileSync(sourcePath, destPath);
        
        // Delete original file
        fs.unlinkSync(sourcePath);
        
        console.log(`✓ Moved: ${path.basename(sourcePath)}`);
        return true;
    } catch (error) {
        console.error(`✗ Error moving ${sourcePath}:`, error.message);
        return false;
    }
}

// Move entire directory
function moveDirectory(sourceDir, destDir) {
    if (!fs.existsSync(sourceDir)) {
        console.log(`⚠️  Directory not found: ${sourceDir}`);
        return false;
    }

    try {
        // Create destination directory
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        // Read all files in source directory
        const files = fs.readdirSync(sourceDir, { withFileTypes: true });

        files.forEach(file => {
            const sourcePath = path.join(sourceDir, file.name);
            const destPath = path.join(destDir, file.name);

            if (file.isDirectory()) {
                // Recursively move subdirectories
                moveDirectory(sourcePath, destPath);
            } else {
                // Copy file
                fs.copyFileSync(sourcePath, destPath);
            }
        });

        // Remove the source directory after copying all contents
        fs.rmSync(sourceDir, { recursive: true, force: true });
        
        console.log(`✓ Moved directory: ${path.basename(sourceDir)}`);
        return true;
    } catch (error) {
        console.error(`✗ Error moving directory ${sourceDir}:`, error.message);
        return false;
    }
}

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  Dragon Pro - Move Unused Files to extra-code             ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Create extra-code directory structure
console.log('=== Creating extra-code Directory ===\n');
createExtraCodeDirs();
console.log('✓ Created extra-code directory structure\n');

// Move unused pages
console.log('=== Moving Unused Page Files ===\n');
let pageCount = 0;
unusedPages.forEach(page => {
    const sourcePath = path.join(basePath, 'pages', page);
    const destPath = path.join(extraCodePath, 'pages', page);
    if (moveFile(sourcePath, destPath)) pageCount++;
});
console.log(`\n✓ Moved ${pageCount} page files\n`);

// Move unused page directories
console.log('=== Moving Unused Page Directories ===\n');
let pageDirCount = 0;
unusedPageDirs.forEach(dir => {
    const sourceDir = path.join(basePath, 'pages', dir);
    const destDir = path.join(extraCodePath, 'pages', dir);
    if (moveDirectory(sourceDir, destDir)) pageDirCount++;
});
console.log(`\n✓ Moved ${pageDirCount} page directories\n`);

// Move unused component directories
console.log('=== Moving Unused Component Directories ===\n');
let compCount = 0;
unusedComponentDirs.forEach(dir => {
    const sourceDir = path.join(basePath, 'components', dir);
    const destDir = path.join(extraCodePath, 'components', dir);
    if (moveDirectory(sourceDir, destDir)) compCount++;
});
console.log(`\n✓ Moved ${compCount} component directories\n`);

// Move unused component files
console.log('=== Moving Unused Component Files ===\n');
let compFileCount = 0;
unusedComponentFiles.forEach(file => {
    const sourcePath = path.join(basePath, 'components', file);
    const destPath = path.join(extraCodePath, 'components', file);
    if (moveFile(sourcePath, destPath)) compFileCount++;
});
console.log(`\n✓ Moved ${compFileCount} component files\n`);

// Move unused layout files
console.log('=== Moving Unused Layout Files ===\n');
let layoutCount = 0;
unusedLayouts.forEach(layout => {
    const sourcePath = path.join(basePath, 'layout', layout);
    const destPath = path.join(extraCodePath, 'layout', layout);
    if (moveFile(sourcePath, destPath)) layoutCount++;
});
console.log(`\n✓ Moved ${layoutCount} layout files\n`);

// Create a README in extra-code folder
const readmeContent = `# Extra Code - Dragon Pro

This directory contains all unused modules that were removed from the main source code.

## Contents

### Pages (${pageCount} files + ${pageDirCount} directories)
- Dashboards (home, analytics)
- Reports (sales, leads, project, timesheets)
- Applications (chat, email, tasks, notes, calendar, storage)
- Proposals (list, view, edit, create)
- Payments (list, view, create)
- Leads (list, view, create)
- Projects (list, view, create)
- Widgets (lists, tables, charts, statistics, miscellaneous)
- Settings (13 different pages)
- Authentication variants (17 extra auth pages)
- Help/Knowledgebase

### Components (${compCount} directories + ${compFileCount} files)
- Chat components
- Email components
- Task components
- Note components
- Calendar components
- Storage components
- Proposal components
- Payment components
- Leads components
- Project components
- Settings components
- Widget components
- Authentication form components

### Layouts (${layoutCount} files)
- layoutApplications.jsx
- layoutSetting.jsx

## Moved on
${new Date().toLocaleString()}

## To Restore
If you need to restore any of these files:
1. Copy the file/folder from extra-code back to src
2. Uncomment the corresponding routes in src/route/router.jsx
3. Uncomment the corresponding menu items in src/utils/fackData/menuList.js
4. Test the application

## Note
These files are preserved for future reference or restoration.
Do not delete this directory unless you are certain you won't need these modules.
`;

fs.writeFileSync(path.join(extraCodePath, 'README.md'), readmeContent, 'utf8');
console.log('✓ Created README.md in extra-code directory\n');

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  ✓ All unused files have been moved to extra-code!        ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('Summary:');
console.log(`- Page Files: ${pageCount}`);
console.log(`- Page Directories: ${pageDirCount}`);
console.log(`- Component Directories: ${compCount}`);
console.log(`- Component Files: ${compFileCount}`);
console.log(`- Layout Files: ${layoutCount}`);
console.log(`\nTotal: ${pageCount + compFileCount + layoutCount} files`);
console.log(`Total Directories: ${pageDirCount + compCount}`);
console.log(`\nAll files moved to: ${extraCodePath}`);
console.log(`\nNext: Test your app with: npm run dev\n`);
