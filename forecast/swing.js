// Backend-like data storage for swing states with partisan lean included
let pollData = [
    { state: 'Florida', electoralVotes: 30, harris: 44.1, trump: 48.6, partisanLean: -.7396878 },
    { state: 'Pennsylvania', electoralVotes: 19, harris: 47.7, trump: 46, partisanLean: -.296776 },
    { state: 'Wisconsin', electoralVotes: 10, harris: 48.9, trump: 45.5, partisanLean: -.3839976 },
    { state: 'Michigan', electoralVotes: 15, harris: 47.9, trump: 44.8, partisanLean: -.1175974 },
    { state: 'Arizona', electoralVotes: 11, harris: 46.6, trump: 45.1, partisanLean: -.7171309 },
    { state: 'Georgia', electoralVotes: 16, harris: 46.8, trump: 47.5, partisanLean: -.7357549 },
    { state: 'Nevada', electoralVotes: 6, harris: 46.2, trump: 44.9, partisanLean: -.259005 },
    { state: 'North Carolina', electoralVotes: 15, harris: 46.9, trump: 46.5, partisanLean: -.4815506 }
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
