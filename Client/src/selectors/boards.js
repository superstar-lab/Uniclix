export default (boards = [], {selected}) => {

    if(!boards.length) return boards;

    return boards.filter((board) => {
        let filter = true;

        if(!isNaN(selected)){
            filter = filter && board.selected == selected;
        }

        return filter;
    });
};