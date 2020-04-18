export const membersMenuItems = [
    {
        id: 'twitter-booster_manage_posts',
        displayName: 'Manage posts',
        uri: '/scheduled',
        icon: 'pencil'
    }
];

export const getMenuItems = (socialMedia) => ([
  {
      id: 'twitter-booster_manage_posts',
      displayName: 'Manage posts',
      uri: '/scheduled',
      icon: 'pencil'
  },
  {
      id: 'twitter-booster_monitor_activity',
      displayName: 'Monitor activity',
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
      displayName: 'Accounts',
      uri: '/settings/manage-account',
      icon: 'list'
  },
]);

export const settingsMenus = {
    'member': [
        {
            id: "profile",
            displayName: "Profile",
            uri: "/settings/profile",
            icon: "user"
        }
    ],
    'admin': [
        {
            id: "profile",
            displayName: "Profile",
            uri: "/settings/profile",
            icon: "user"
        },
        {
            id: "team",
            displayName: "Team",
            uri: "/settings/team",
            icon: "users"
        },
        {
            id: "manage-account",
            displayName: "Manage Account",
            uri: "/settings/manage-account",
            icon: "list"
        }
    ],
    'owner': [
        {
            id: "profile",
            displayName: "Profile",
            uri: "/settings/profile",
            icon: "user"
        },
        {
            id: "team",
            displayName: "Team",
            uri: "/settings/team",
            icon: "users"
        },
        {
            id: "manage-account",
            displayName: "Manage Account",
            uri: "/settings/manage-account",
            icon: "list"
        },
        {
            id: "billing",
            displayName: "Billing",
            uri: "/settings/billing",
            icon: "money-bill-alt"
        }
    ]
};
