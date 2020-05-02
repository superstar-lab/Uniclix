const MEMBER_ROUTES = [
  '/',
  '/accounts',
  '/scheduled',
  '/scheduled/posts',
  '/settings',
  '/settings/profile'
];

const ADMIN_ROUTES = [
  ...MEMBER_ROUTES,
  '/scheduled/unapproved',
  '/scheduled/past',
  '/monitor-activity',
  '/content-finder',
  '/analytics/facebook',
  '/analytics/twitter',
  '/analytics/linkedin',
  '/settings/manage-account',
  '/settings',
  '/settings/team',
];

const OWNER_ROUTES = [
  ...ADMIN_ROUTES,
  '/settings/billing',
  '/settings/billing/plans',
  '/settings/billing/thank-you-basic',
  '/settings/billing/thank-you-premium',
  '/settings/billing/thank-you-pro'
];

const ROUTES = {
  'member': MEMBER_ROUTES,
  'admin': ADMIN_ROUTES,
  'owner': OWNER_ROUTES
}

export default ROUTES;
