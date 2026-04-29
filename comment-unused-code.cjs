const fs = require('fs');
const path = require('path');

/**
 * Script to comment out unused code related to commented menu items
 * This script will:
 * 1. Create backups of all modified files
 * 2. Comment out routes in router.jsx
 * 3. Comment out imports in router.jsx
 * 4. Optionally move unused files to a backup folder
 */

const BACKUP_DIR = path.join(__dirname, 'code-backup');
const ROUTER_PATH = path.join(__dirname, 'src/route/router.jsx');

// Create backup directory
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

/**
 * Create a backup of a file
 */
function createBackup(filePath) {
    const fileName = path.basename(filePath);
    const backupPath = path.join(BACKUP_DIR, `${fileName}.backup`);
    
    if (fs.existsSync(filePath)) {
        fs.copyFileSync(filePath, backupPath);
        console.log(`✓ Backup created: ${backupPath}`);
        return true;
    }
    return false;
}

/**
 * Comment out unused imports in router.jsx
 */
function commentRouterImports() {
    console.log('\n=== Commenting Router Imports ===\n');
    
    if (!createBackup(ROUTER_PATH)) {
        console.error('✗ Router file not found!');
        return;
    }
    
    let content = fs.readFileSync(ROUTER_PATH, 'utf8');
    
    const importsToComment = [
        'import Home from "../pages/home";',
        'import Analytics from "../pages/analytics";',
        'import ReportsSales from "../pages/reports-sales";',
        'import ReportsLeads from "../pages/reports-leads";',
        'import ReportsProject from "../pages/reports-project";',
        'import ReportsTimesheets from "../pages/reports-timesheets";',
        'import AppsChat from "../pages/apps-chat";',
        'import AppsEmail from "../pages/apps-email";',
        'import AppsTasks from "../pages/apps-tasks";',
        'import AppsNotes from "../pages/apps-notes";',
        'import AppsCalender from "../pages/apps-calender";',
        'import AppsStorage from "../pages/apps-storage";',
        'import Proposalist from "../pages/proposal-list";',
        'import ProposalView from "../pages/proposal-view";',
        'import ProposalEdit from "../pages/proposal-edit";',
        'import ProposalCreate from "../pages/proposal-create";',
        'import LeadsList from "../pages/leadsList";',
        'import LeadsView from "../pages/leads-view";',
        'import LeadsCreate from "../pages/leads-create";',
        'import PaymentList from "../pages/payment-list";',
        'import PaymentView from "../pages/payment-view.jsx";',
        'import PaymentCreate from "../pages/payment-create";',
        'import ProjectsList from "../pages/projects-list";',
        'import ProjectsView from "../pages/projects-view";',
        'import ProjectsCreate from "../pages/projects-create";',
        'import SettingsGaneral from "../pages/settings-ganeral";',
        'import SettingsSeo from "../pages/settings-seo";',
        'import SettingsTags from "../pages/settings-tags";',
        'import SettingsEmail from "../pages/settings-email";',
        'import SettingsTasks from "../pages/settings-tasks";',
        'import SettingsLeads from "../pages/settings-leads";',
        'import SettingsMiscellaneous from "../pages/settings-miscellaneous";',
        'import SettingsRecaptcha from "../pages/settings-recaptcha";',
        'import SettingsLocalization from "../pages/settings-localization";',
        'import SettingsCustomers from "../pages/settings-customers";',
        'import SettingsGateways from "../pages/settings-gateways";',
        'import SettingsFinance from "../pages/settings-finance";',
        'import SettingsSupport from "../pages/settings-support";',
        'import HelpKnowledgebase from "../pages/help-knowledgebase";',
        'import WidgetsLists from "../pages/widgets-lists";',
        'import WidgetsTables from "../pages/widgets-tables";',
        'import WidgetsCharts from "../pages/widgets-charts";',
        'import WidgetsStatistics from "../pages/widgets-statistics";',
        'import WidgetsMiscellaneous from "../pages/widgets-miscellaneous";',
        'import LayoutSetting from "../layout/layoutSetting";',
        'import LayoutApplications from "../layout/layoutApplications";'
    ];
    
    importsToComment.forEach(importStatement => {
        if (content.includes(importStatement)) {
            content = content.replace(importStatement, `// ${importStatement}`);
            console.log(`✓ Commented: ${importStatement.substring(0, 50)}...`);
        }
    });
    
    fs.writeFileSync(ROUTER_PATH, content, 'utf8');
    console.log('\n✓ Router imports commented successfully!\n');
}

/**
 * Comment out unused routes in router.jsx
 */
function commentRouterRoutes() {
    console.log('\n=== Commenting Router Routes ===\n');
    
    let content = fs.readFileSync(ROUTER_PATH, 'utf8');
    
    // Routes to comment (path-element pairs)
    const routesToComment = [
        // Dashboards
        { path: '/dashboard', element: 'Home' },
        { path: '/dashboards/analytics', element: 'Analytics' },
        
        // Reports
        { path: '/reports/sales', element: 'ReportsSales' },
        { path: '/reports/leads', element: 'ReportsLeads' },
        { path: '/reports/project', element: 'ReportsProject' },
        { path: '/reports/timesheets', element: 'ReportsTimesheets' },
        
        // Applications
        { path: '/applications/chat', element: 'AppsChat' },
        { path: '/applications/email', element: 'AppsEmail' },
        { path: '/applications/tasks', element: 'AppsTasks' },
        { path: '/applications/notes', element: 'AppsNotes' },
        { path: '/applications/calender', element: 'AppsCalender' },
        { path: '/applications/storage', element: 'AppsStorage' },
        
        // Proposals
        { path: '/proposal/list', element: 'Proposalist' },
        { path: '/proposal/view', element: 'ProposalView' },
        { path: '/proposal/edit', element: 'ProposalEdit' },
        { path: '/proposal/create', element: 'ProposalCreate' },
        
        // Payments
        { path: '/payment/list', element: 'PaymentList' },
        { path: '/payment/view', element: 'PaymentView' },
        { path: '/payment/create', element: 'PaymentCreate' },
        
        // Leads
        { path: '/leads/list', element: 'LeadsList' },
        { path: '/leads/view', element: 'LeadsView' },
        { path: '/leads/create', element: 'LeadsCreate' },
        
        // Projects
        { path: '/projects/list', element: 'ProjectsList' },
        { path: '/projects/view', element: 'ProjectsView' },
        { path: '/projects/create', element: 'ProjectsCreate' },
        
        // Widgets
        { path: '/widgets/lists', element: 'WidgetsLists' },
        { path: '/widgets/tables', element: 'WidgetsTables' },
        { path: '/widgets/charts', element: 'WidgetsCharts' },
        { path: '/widgets/statistics', element: 'WidgetsStatistics' },
        { path: '/widgets/miscellaneous', element: 'WidgetsMiscellaneous' },
        
        // Settings
        { path: '/settings/ganeral', element: 'SettingsGaneral' },
        { path: '/settings/seo', element: 'SettingsSeo' },
        { path: '/settings/tags', element: 'SettingsTags' },
        { path: '/settings/email', element: 'SettingsEmail' },
        { path: '/settings/tasks', element: 'SettingsTasks' },
        { path: '/settings/leads', element: 'SettingsLeads' },
        { path: '/settings/Support', element: 'SettingsSupport' },
        { path: '/settings/finance', element: 'SettingsFinance' },
        { path: '/settings/gateways', element: 'SettingsGateways' },
        { path: '/settings/customers', element: 'SettingsCustomers' },
        { path: '/settings/localization', element: 'SettingsLocalization' },
        { path: '/settings/recaptcha', element: 'SettingsRecaptcha' },
        { path: '/settings/miscellaneous', element: 'SettingsMiscellaneous' },
        
        // Help
        { path: '/help/knowledgebase', element: 'HelpKnowledgebase' }
    ];
    
    routesToComment.forEach(route => {
        const routePattern = new RegExp(
            `(\\s*){\\s*path:\\s*["']${route.path.replace(/\//g, '\\/')}["'],\\s*element:\\s*<${route.element}\\s*\\/>\\s*},?`,
            'g'
        );
        
        if (routePattern.test(content)) {
            content = content.replace(routePattern, (match) => {
                const commented = match.split('\n').map(line => `// ${line}`).join('\n');
                console.log(`✓ Commented route: ${route.path}`);
                return commented;
            });
        }
    });
    
    // Comment out entire LayoutApplications section
    const layoutAppsPattern = /{[\s\S]*?path:\s*["']\/["'],[\s\S]*?element:\s*<LayoutApplications[\s\S]*?children:\s*\[[\s\S]*?\/applications\/storage[\s\S]*?\],[\s\S]*?}/;
    content = content.replace(layoutAppsPattern, (match) => {
        console.log('✓ Commenting LayoutApplications section...');
        return match.split('\n').map(line => `// ${line}`).join('\n');
    });
    
    // Comment out entire LayoutSetting section
    const layoutSettingPattern = /{[\s\S]*?path:\s*["']\/["'],[\s\S]*?element:\s*<LayoutSetting[\s\S]*?children:\s*\[[\s\S]*?\/settings\/miscellaneous[\s\S]*?\],[\s\S]*?}/;
    content = content.replace(layoutSettingPattern, (match) => {
        console.log('✓ Commenting LayoutSetting section...');
        return match.split('\n').map(line => `// ${line}`).join('\n');
    });
    
    fs.writeFileSync(ROUTER_PATH, content, 'utf8');
    console.log('\n✓ Router routes commented successfully!\n');
}

/**
 * Create a list of files to archive
 */
function createArchiveList() {
    console.log('\n=== Creating Archive List ===\n');
    
    const filesToArchive = {
        pages: [
            'home.jsx', 'analytics.jsx',
            'reports-sales.jsx', 'reports-leads.jsx', 'reports-project.jsx', 'reports-timesheets.jsx',
            'apps-chat.jsx', 'apps-email.jsx', 'apps-tasks.jsx', 'apps-notes.jsx', 'apps-calender.jsx', 'apps-storage.jsx',
            'proposal-list.jsx', 'proposal-view.jsx', 'proposal-edit.jsx', 'proposal-create.jsx',
            'payment-list.jsx', 'payment-view.jsx', 'payment-create.jsx',
            'leadsList.jsx', 'leads-view.jsx', 'leads-create.jsx',
            'projects-list.jsx', 'projects-view.jsx', 'projects-create.jsx',
            'settings-ganeral.jsx', 'settings-seo.jsx', 'settings-tags.jsx', 'settings-email.jsx',
            'settings-tasks.jsx', 'settings-leads.jsx', 'settings-miscellaneous.jsx', 'settings-recaptcha.jsx',
            'settings-localization.jsx', 'settings-customers.jsx', 'settings-gateways.jsx', 'settings-finance.jsx', 'settings-support.jsx',
            'widgets-lists.jsx', 'widgets-tables.jsx', 'widgets-charts.jsx', 'widgets-statistics.jsx', 'widgets-miscellaneous.jsx'
        ],
        components: [
            'chats', 'emails', 'tasks', 'notes', 'calender', 'storage',
            'proposal', 'proposalEditCreate', 'proposalView',
            'payment',
            'leads', 'leadsViewCreate',
            'projectsList', 'projectsCreate', 'projectsView',
            'setting',
            'widgetsCharts', 'widgetsList', 'widgetsMiscellaneous', 'widgetsStatistics', 'widgetsTables'
        ],
        layouts: [
            'layoutApplications.jsx', 'layoutSetting.jsx'
        ],
        helpPages: [
            'help-knowledgebase'
        ]
    };
    
    const archiveListPath = path.join(BACKUP_DIR, 'files-to-archive.json');
    fs.writeFileSync(archiveListPath, JSON.stringify(filesToArchive, null, 2), 'utf8');
    
    console.log(`✓ Archive list created: ${archiveListPath}\n`);
    console.log('Files to archive:');
    console.log('- Pages:', filesToArchive.pages.length);
    console.log('- Components:', filesToArchive.components.length);
    console.log('- Layouts:', filesToArchive.layouts.length);
    console.log('- Help Pages:', filesToArchive.helpPages.length);
}

/**
 * Main execution
 */
function main() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  Dragon Pro - Code Cleanup Script                         ║');
    console.log('║  Commenting unused code related to menu items             ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    try {
        // Step 1: Comment imports
        commentRouterImports();
        
        // Step 2: Comment routes
        commentRouterRoutes();
        
        // Step 3: Create archive list
        createArchiveList();
        
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║  ✓ Script completed successfully!                         ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');
        
        console.log('Next Steps:');
        console.log('1. Review the changes in src/route/router.jsx');
        console.log('2. Check the backup files in code-backup/');
        console.log('3. Optionally move unused files to archive folder');
        console.log('4. Test the application to ensure everything works\n');
        
        console.log('To restore: Copy files from code-backup/ folder\n');
        
    } catch (error) {
        console.error('\n✗ Error occurred:', error.message);
        console.error('Check the backup files in code-backup/ folder to restore\n');
    }
}

// Run the script
main();
