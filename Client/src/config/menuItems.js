const getMenuItems = (socialMedia) => ([
  {
      id: 'twitter-booster_manage_posts',
      displayName: 'Manage Posts',
      uri: '/scheduled',
      icon: 'pencil'
  },
  {
      id: 'twitter-booster_monitor_activity',
      displayName: 'Monitor Activity',
      uri: '/monitor-activity',
      icon: 'desktop'
  },
  {
      id: 'twitter-booster_search',
      displayName: 'Content Finder',
      uri: '/content-finder',
      icon: 'search'
  },
  {
      id: 'analytics',
      displayName: 'Analytics',
      uri: `/analytics/${socialMedia}`,
      icon: 'chart-bar'
  },
  {
      id: 'twitter-booster_manage_accounts',
      displayName: 'Manage Accounts',
      uri: '/settings/manage-account',
      icon: 'list'
  },
]);

export default getMenuItems;
