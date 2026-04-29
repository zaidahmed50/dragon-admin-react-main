#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Unused page files to comment
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
    // Authentication pages (extra variants - keeping only login-cover)
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

// Unused component directories to comment
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

// Unused layout files
const unusedLayouts = [
    'layoutApplications.jsx',
    'layoutSetting.jsx'
];

// Unused component files that need to be commented
const unusedComponentFiles = [
    'authentication/LoginForm.jsx',
    'authentication/MaintenaceForm.jsx',
    'authentication/OtpVerifyForm.jsx',
    'authentication/RegisterForm.jsx',
    'authentication/ResetForm.jsx'
];

const basePath = path.join(__dirname, 'src');

function commentFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filePath}`);
        return false;
    }

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if already commented
        if (content.startsWith('// UNUSED')) {
            console.log(`⊘ Already commented: ${path.basename(filePath)}`);
            return false;
        }
        
        // Add comment header and comment all lines
        const commented = '// UNUSED - Commented out as per menu cleanup\n' + 
                         content.split('\n').map(line => `// ${line}`).join('\n') +
                         '\n\nexport default null;';
        
        fs.writeFileSync(filePath, commented, 'utf8');
        console.log(`✓ Commented: ${path.basename(filePath)}`);
        return true;
    } catch (error) {
        console.error(`✗ Error commenting ${filePath}:`, error.message);
        return false;
    }
}

function commentDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        console.log(`⚠️  Directory not found: ${dirPath}`);
        return;
    }

    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    files.forEach(file => {
        const fullPath = path.join(dirPath, file.name);
        
        if (file.isDirectory()) {
            commentDirectory(fullPath);
        } else if (file.name.endsWith('.jsx') || file.name.endsWith('.js')) {
            commentFile(fullPath);
        }
    });
}

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  Dragon Pro - Comment Unused Modules Script               ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Comment unused pages
console.log('=== Commenting Unused Page Files ===\n');
let pageCount = 0;
unusedPages.forEach(page => {
    const pagePath = path.join(basePath, 'pages', page);
    if (commentFile(pagePath)) pageCount++;
});
console.log(`\n✓ Commented ${pageCount} page files\n`);

// Comment help-knowledgebase directory
console.log('=== Commenting Help Knowledgebase ===\n');
const helpPath = path.join(basePath, 'pages', 'help-knowledgebase');
if (fs.existsSync(helpPath)) {
    commentDirectory(helpPath);
    console.log(`✓ Commented help-knowledgebase directory\n`);
}

// Comment unused component directories
console.log('=== Commenting Unused Component Directories ===\n');
let compCount = 0;
unusedComponentDirs.forEach(dir => {
    const dirPath = path.join(basePath, 'components', dir);
    if (fs.existsSync(dirPath)) {
        commentDirectory(dirPath);
        compCount++;
    }
});
console.log(`\n✓ Commented ${compCount} component directories\n`);

// Comment unused component files
console.log('=== Commenting Unused Component Files ===\n');
let compFileCount = 0;
unusedComponentFiles.forEach(file => {
    const filePath = path.join(basePath, 'components', file);
    if (commentFile(filePath)) compFileCount++;
});
console.log(`\n✓ Commented ${compFileCount} component files\n`);

// Comment unused layout files
console.log('=== Commenting Unused Layout Files ===\n');
let layoutCount = 0;
unusedLayouts.forEach(layout => {
    const layoutPath = path.join(basePath, 'layout', layout);
    if (commentFile(layoutPath)) layoutCount++;
});
console.log(`\n✓ Commented ${layoutCount} layout files\n`);

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  ✓ All unused modules have been commented!                ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('Summary:');
console.log(`- Page Files: ${pageCount}`);
console.log(`- Component Directories: ${compCount}`);
console.log(`- Component Files: ${compFileCount}`);
console.log(`- Layout Files: ${layoutCount}`);
console.log(`\nTotal: ${pageCount + compFileCount + layoutCount} files + ${compCount} directories`);
console.log(`\nNext: Test your app with: npm run dev\n`);
