// generatorUtils.js
function generateUsernameFromName(name) {
    // Remove any leading or trailing whitespace
    name = name.trim();

    // Split the name into parts (first name, middle name, last name)
    const nameParts = name.split(/\s+/);

    // Handle cases where the name is only one word
    if (nameParts.length === 1) {
        // If there's only one name part, use it directly and add a random number
        return `${nameParts[0].toLowerCase()}${Math.floor(Math.random() * 10000)}`;
    }

    // Generate the username by combining the first letter of the first name with the last name
    const firstNameInitial = nameParts[0].charAt(0).toLowerCase();
    const lastName = nameParts[nameParts.length - 1].toLowerCase();

    // Combine the initial and last name, then add a random number
    const username = `${firstNameInitial}${lastName}${Math.floor(Math.random() * 10000)}`;

    return username;
}

module.exports = { generateUsernameFromName };
