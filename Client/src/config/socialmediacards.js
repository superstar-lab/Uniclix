const getSocialMediaCards = () => ({
    twitterIcons: [
        {
            label: "Home",
            value: "home",
            icon: "home"
        },
        {
            label: "Search",
            value: "search",
            icon: "search"
        },
        {
            label: "Mentions",
            value: "mentions",
            icon: "at"
        },
        {
            label: "Retweets",
            value: "retweets",
            icon: "retweet"
        },
        {
            label: "Followers",
            value: "followers",
            icon: "user-plus"
        },
        {
            label: "Likes",
            value: "likes",
            icon: "heart"
        },
        {
            label: "My Tweets",
            value: "tweets",
            icon: "mail-forward"
        },
        {
            label: "Scheduled",
            value: "scheduled",
            icon: "clock-o"
        }
    ],

    facebookIcons: [
        {
            label: "Timeline",
            value: "timeline",
            icon: "history"
        },
        {
            label: "My Posts",
            value: "myPosts",
            icon: "bullhorn"
        },
        {
            label: "Mentions",
            value: "mentions",
            icon: "at"
        },
        {
            label: "Messages",
            value: "conversations",
            icon: "envelope"
        },
        {
            label: "Unpublished",
            value: "unpublished",
            icon: "calendar"
        },
        {
            label: "Pages",
            value: "pages",
            icon: "flag"
        },
        {
            label: "Scheduled",
            value: "scheduled",
            icon: "clock-o"
        }
    ],

    linkedinIcons: [
        {
            label: "Home",
            value: "home",
            icon: "home"
        },
        {
            label: "My Update",
            value: "my_updates",
            icon: "mail-forward"
        },
        {
            label: "Scheduled",
            value: "scheduled",
            icon: "clock-o"
        }
    ],

    socialNetworkIcons: [
        {
            id: 0, label: "Twitter", icon: "/images/monitor-icons/twitter-small.svg"
        },
        {
            id: 1, label: "Facebook", icon: "/images/monitor-icons/facebook-small.svg"
        }
    ]
});

export default getSocialMediaCards;