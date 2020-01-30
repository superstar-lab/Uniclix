import React, { Component } from 'react';
import { Select } from 'antd';
import { Grid } from '@material-ui/core';
import Tabs, { Tab } from '../../CustomTabs';
import RenameTabModal from './RenameTabModal';
import StreamCreators from './StreamCreators';
import StreamItems from './StreamItems';
import MonitorRightbar from './MonitorRightbar';
import getSocialMediaCards from '../../../config/socialmediacards';

const { Option } = Select;

class Activities extends Component {
    state = {
        socialMedias: [
            "Twitter",
            "Facebook"
        ],
        tabs: [],
        activeTab: 0,
        isOpenModal: false,
        socialValue: 'Twitter',
        socialMediaCards: {},
        socialCards: {}
    }

    componentWillMount() {
        let socialMediaCards = getSocialMediaCards();
        this.setState({ socialMediaCards: socialMediaCards });
        this.setState({ socialCards: socialMediaCards.socialNetworkIcons });
        // Call data from API
        let tabs = [
            {
                key: 'newTab_' + Date.now(),
                title: 'New tab',
                selectedSocial: 'Twitter',
                streamList: []
            }
        ]
        this.setState({ tabs: tabs });
    }

    handleTabSwitch = (active) => {
        this.setState({ activeTab: active });
    }

    handleTabPositionChange = (a, b) => {
        const { tabs, activeTab } = this.state;
        if (a < 0 || b < 0)
            return;

        let c = tabs[a];
        tabs[a] = tabs[b];
        tabs[b] = c;
        this.setState({ tabs: tabs });

        if (activeTab == a) {
            this.setState({ activeTab: b });
        } else if (activeTab == b) {
            this.setState({ activeTab: a });
        }

        this.forceUpdate()
    }

    handleTabClose = (index) => {
        const { tabs, activeTab } = this.state;
        if (tabs.length == 1) return;

        tabs.splice(index, 1);
        this.setState({ tabs: tabs });

        if (activeTab >= tabs.length) {
            this.setState({ activeTab: tabs.length - 1 });
        }

        this.forceUpdate();
    }

    handleTabAdd = () => {
        let newTab = {
            key: 'newTab_' + Date.now(),
            title: 'New tab',
            selectedSocial: 'Twitter',
            streamList: []
        };
        this.setState((prevState) => ({
            ...prevState,
            tabs: [
                ...prevState.tabs,
                newTab,
            ],
            activeTab: prevState.tabs.length
        }));
    }

    handleRefresh = () => {
        console.log('refresh');
    }

    handleTabRename = () => {
        this.setState({ isOpenModal: true });
    };

    onCloseModal = () => {
        this.setState({ isOpenModal: false });
    };

    onRenameSuccess = (tab) => {
        const { tabs, activeTab } = this.state;

        tabs[activeTab].title = tab.title;
        this.setState({ tabs: tabs });
        this.setState({ isOpenModal: false });
    };

    onChangeSocialMedias = (idx, val) => {
        let tabs = this.state.tabs;
        tabs[idx].selectedSocial = val;
        this.setState({ tabs: tabs });
        this.setState({ socialValue: val });
    };

    handleClickCreator = (idx, creator) => {
        let tabs = this.state.tabs;

        // Create new stream card
        let newStream = {
            title: creator
        }
        tabs[idx].streamList.push(newStream);
        this.setState({ tabs: tabs });
    }

    render() {
        const {
            state: {
                tabs,
                activeTab,
                isOpenModal,
                socialMedias,
                socialMediaCards,
                socialCards,
                socialValue
            },
            props: {
                refreshRate,
            },
            handleTabSwitch,
            handleTabPositionChange,
            handleTabClose,
            handleTabAdd,
            handleRefresh,
            handleTabRename,
            onCloseModal,
            onRenameSuccess,
            onChangeSocialMedias,
            handleClickCreator
        } = this;

        return (
            <div>
                <Tabs
                    active={activeTab}
                    onTabSwitch={(idx) => handleTabSwitch(idx)}
                    onTabPositionChange={(a, b) => handleTabPositionChange(a, b)}
                    onTabClose={(idx) => handleTabClose(idx)}
                    onTabAdd={() => handleTabAdd()}
                    onTabRename={() => handleTabRename()}
                    onRefresh={() => handleRefresh()}
                    draggable={true}
                    showClose={true}
                >
                    {
                        tabs.map((tab, index) => {
                            if (tab.streamList.length == 0) {
                                return (
                                    <Tab
                                        key={index}
                                        title={tab.title}
                                        showClose={true}
                                    >
                                        <div className="monitor-label">
                                            <span className="monitor-spacing">Social Network</span>
                                            <Select className="monitor-smalltitle" size="default" value={tab.selectedSocial} onChange={(val) => onChangeSocialMedias(index, val)}>
                                                {socialMedias.map((socialMedia, idx) => (
                                                    <Option value={socialMedia} key={idx}>
                                                        <span className="social-media-selector-option">{socialMedia}</span>
                                                    </Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <Grid container>
                                            <Grid item md={9}>
                                                <StreamCreators
                                                    creators={tab.selectedSocial == 'Twitter' ? socialMediaCards.twitterBigIcons : socialMediaCards.facebookBigIcons}
                                                    onClickCreator={(val) => handleClickCreator(index, val)}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Tab>
                                );
                            } else {
                                return (
                                    <Tab
                                        key={index}
                                        title={tab.title}
                                        showClose={true}
                                    >
                                        {/* <div className="monitor-rightspacing"> */}
                                        <div>
                                            <MonitorRightbar
                                                socialCards={socialCards}
                                                socialValue={socialValue}
                                                creators={tab.selectedSocial == 'Twitter' ? socialMediaCards.twitterSmallIcons : socialMediaCards.facebookSmallIcons}
                                                onChangeSocial={(val) => onChangeSocialMedias(index, val)}
                                                onClickCreator={(val) => handleClickCreator(index, val)}
                                            />
                                            <StreamItems
                                                streams={tab.streamList}
                                                refreshRate={parseInt(refreshRate)}
                                                selectedTab={tab.key}
                                            />
                                        </div>
                                    </Tab>
                                );
                            }
                        })
                    }
                </Tabs>
                <RenameTabModal
                    isOpen={isOpenModal}
                    tabData={tabs[activeTab]}
                    onClose={() => onCloseModal()}
                    onRenameSuccess={(tab) => onRenameSuccess(tab)}
                />
            </div>
        );
    }
}

export default Activities;