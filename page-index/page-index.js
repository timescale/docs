const apiReferencePageIndex = require("../api/page-index/page-index");
const selfHostedPageIndex = require("../self-hosted/page-index/page-index");
const timescaleMSTPageIndex = require("../mst/page-index/page-index");
const gsgPageIndex = require("../getting-started/page-index/page-index");
const timescaleUsingPageIndex = require("../use-timescale/page-index/page-index");
const navigationPageIndex = require("../navigation/page-index/page-index");
const tutorialsPageIndex = require("../tutorials/page-index/page-index.js");
const codeQuickStartsPageIndex = require("../quick-start/page-index/page-index.js");
const migrationPageIndex = require("../migrate/page-index/page-index.js");
const timescaleAboutPageIndex = require("../about/page-index/page-index");
const AIPageIndex = require("../embed-ai-in-your-data/page-index/page-index");
const AdminTimscaleCloud = require("../administer-your-deployment/page-index/page-index");
const AdminMST = require("../administer-mst/page-index/page-index");
const AdminSelfHosted = require("../administer-self-hosted/page-index/page-index");
const Troubleshooting = require("../troubleshooting/page-index/page-index");
const AccessAndControl = require("../access-and-control/page-index/page-index");
const DataSecurity = require("../data-security-and-reliability/page-index/page-index");
const DataIngestMigrate = require("../data-ingestion-and-migration/page-index/page-index");

const EfficientStorage = require("../efficient-storage/page-index/page-index");
const QueryPerformance = require("../query-performance-and-scalability/page-index/page-index");
const Reference = require("../reference/page-index/page-index");


module.exports = [
  ...gsgPageIndex,
  ...timescaleAboutPageIndex,
  ...selfHostedPageIndex,
  ...timescaleMSTPageIndex,
  ...tutorialsPageIndex,
  ...navigationPageIndex,
  ...Troubleshooting,
  ...AIPageIndex,
  ...AccessAndControl,
  ...DataSecurity,
  ...DataIngestMigrate,
  ...EfficientStorage,
  ...QueryPerformance,
  ...Reference,
  {
    Title: "GitHub",
    type: "external",
    href: "https://github.com",
  },
];
