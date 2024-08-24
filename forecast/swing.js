// Backend-like data storage for swing states with partisan lean included
let pollData = [
    { state: 'Florida', electoralVotes: 30, harris: 43.4, trump: 47.8, partisanLean: -.7396878 }, // Leaning Republican
    { state: 'Pennsylvania', electoralVotes: 19, harris: 46.6, trump: 44.8, partisanLean: -.296776 }, // Leaning Democratic
    { state: 'Wisconsin', electoralVotes: 10, harris: 47.9, trump: 44.3, partisanLean: -.3839976 }, // Leaning Democratic
    { state: 'Michigan', electoralVotes: 15, harris: 47.0, trump: 43.5, partisanLean: -.1175974 }, // Leaning Democratic
    { state: 'Arizona', electoralVotes: 11, harris: 45.8, trump: 44.1, partisanLean: -.7171309 }, // Leaning Republican
    { state: 'Georgia', electoralVotes: 16, harris: 45.8, trump: 46.6, partisanLean: -.7357549 }, // Leaning Republican
    { state: 'Nevada', electoralVotes: 6, harris: 45.3, trump: 44.5, partisanLean: -.259005 },
    { state: 'North Carolina', electoralVotes: 15, harris: 46, trump: 45.4, partisanLean: -.4815506 } // Leaning Republican
]

// Function to fetch the last modified date of the JavaScript file
function updateLastModifiedDate() {
    const scriptFile = 'swing.js'; // Name of your JavaScript file
    fetch(scriptFile, { method: 'HEAD' })
        .then(response => {
            const lastModified = response.headers.get('Last-Modified');
            if (lastModified) {
                const date = new Date(lastModified);
                document.getElementById('update-date').textContent = date.toLocaleString();
            } else {
                document.getElementById('update-date').textContent = 'Unknown';
            }
        })
        .catch(error => {
            console.error('Error fetching last modified date:', error);
            document.getElementById('update-date').textContent = 'Error fetching date';
        });
}

// Call the function when the script loads
updateLastModifiedDate();