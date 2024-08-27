// Backend-like data storage for swing states with partisan lean included
let pollData = [
    { state: 'Florida', electoralVotes: 30, harris: 44.9, trump: 49.6, partisanLean: -.7396878 },
    { state: 'Pennsylvania', electoralVotes: 19, harris: 48.1, trump: 46.2, partisanLean: -.296776 },
    { state: 'Wisconsin', electoralVotes: 10, harris: 49.3, trump: 45.7, partisanLean: -.3839976 },
    { state: 'Michigan', electoralVotes: 15, harris: 48.3, trump: 45, partisanLean: -.1175974 },
    { state: 'Arizona', electoralVotes: 11, harris: 47, trump: 45.5, partisanLean: -.7171309 },
    { state: 'Georgia', electoralVotes: 16, harris: 47.2, trump: 47.8, partisanLean: -.7357549 },
    { state: 'Nevada', electoralVotes: 6, harris: 46.7, trump: 45.3, partisanLean: -.259005 },
    { state: 'North Carolina', electoralVotes: 15, harris: 47.3, trump: 46.7, partisanLean: -.4815506 }
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
