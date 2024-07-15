module.exports = (query) => {
    let filterStatus = [
        {
            name: "All",
            status: "",
            class: "" //class active để bôi xanh nút bấm
        },
        {
            name: "Active",
            status: "active",
            class: ""
        },
        {
            name: "Inactive",
            status: "inactive",
            class: ""
        }
    ];

    if (query.status){
        const index = filterStatus.findIndex(item => item.status == query.status);
        // console.log(index);
        filterStatus[index].class = "active";
    } else {
        const index = filterStatus.findIndex(item => item.status == "");
        // console.log(index);
        filterStatus[index].class = "active";
    }
    
    return filterStatus;
}