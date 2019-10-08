import boardSelector from "./boards";

export default (channels = [], {selected, provider, publishable}) => {

    if(!channels.length) return channels;

    return channels.filter((channel) => {
        let filter = true;

        if(provider){
            filter = channel.type == provider;
        }

        if(publishable){

            try{
                if(typeof(channel.details.account_type) !== "undefined" && channel.type == "facebook"){
                    filter = filter && channel.details.account_type !== "profile";
                }else if(channel.type == "linkedin"){
                    filter = filter && channel.details.account_type !== "page";
                }
            }catch(e){}

        }

        if(!isNaN(selected)){
            if(provider){
                filter = filter && channel.details.selected == selected;
            }else{
                filter = filter && channel.selected == selected;
            }
        }

        return filter;
    });
};

export const channelById = (channels = [], {id}) => {

    if(!channels.length) return channels;

    return channels.filter((channel) => {
        let filter = true;

        if(id){
            filter = channel.id == id;
        }

        return filter;
    })[0];
};

export const streamChannels = (channels = []) => {

    if(!channels.length) return channels;

    return channels.filter((channel) => {
        let filter = true;

        filter = (channel.type == "facebook" || channel.type == "twitter");

        
        try{
            if(typeof(channel.details.account_type) !== "undefined"){
                filter = filter && channel.details.account_type !== "profile";
            }
        }catch(e){}

        return filter;
    });
};

export const publishChannels = (channels = []) => {

    if(!channels.length) return channels;
    
    return channels.map((channel) => {
        if(channel.selected && channel.type == "pinterest" && (typeof(channel.boards) === "undefined" || boardSelector(channel.boards, {selected: 1}).length < 1)){
            return {
                ...channel,
                selected: 0
            }
        }else{
            return {
                ...channel
            }
        }
    });
};

export const findAccounts = (accounts = [], {prop}) => {
    if(!accounts.length) return accounts;

    return accounts.filter((account) => {
        return account.id == prop;
    });
};

export const linkedinPages = (channels = []) => {

    if (!channels.length) return channels;

    return channels.filter((channel) => {
        return channel.type == "linkedin" && channel.details.account_type == 'page';
    });
};