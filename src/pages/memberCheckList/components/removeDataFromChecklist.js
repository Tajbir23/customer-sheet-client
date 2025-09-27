const removeDataFromCheckList = async(gptAccount, memberEmail, data, setData) => {
    console.log("Incoming data:", data);
    
    try {
        // Ensure data is an array
        const dataArray = Array.isArray(data) ? data : [data];
        
        // Find the GPT account in data
        const updatedData = dataArray.map(item => {
            if (item.gptAccount === gptAccount) {
                // Filter out the member with matching email
                return {
                    ...item,
                    members: item.members.filter(member => member.email !== memberEmail)
                };
            }
            return item;
        });

        // Update the state with new data
        setData(updatedData);
    } catch (error) {
        console.error("Error removing member from checklist:", error);
        console.error("Data type:", typeof data);
        console.error("Data value:", data);
    }
}

export default removeDataFromCheckList