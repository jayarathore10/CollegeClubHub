document.getElementById("uploadForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const res = await fetch("/api/recognize", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    if (!data || data.error) {
        alert("Recognition failed: " + (data.error || "Unknown error"));
        return;
    }

    const total = data.total || 0;
    const recognized = data.recognized || [];
    const unknown = data.unknown || 0;

    // Update summary
    document.getElementById("total-count").innerText = total;
    document.getElementById("present-count").innerText = recognized.length;
    document.getElementById("absent-count").innerText = unknown;

    // Show lists when cards clicked
    const presentCard = document.getElementById("present-card");
    const absentCard = document.getElementById("absent-card");
    const listBox = document.getElementById("student-list");
    const listTitle = document.getElementById("list-title");
    const listContent = document.getElementById("list-content");

    presentCard.onclick = () => {
        listBox.style.display = "block";
        listTitle.innerText = "Recognized Students (Roll Numbers)";
        listContent.innerHTML = "";
        recognized.forEach(roll => {
            const li = document.createElement("li");
            li.innerText = roll;
            listContent.appendChild(li);
        });
    };

    absentCard.onclick = () => {
        listBox.style.display = "block";
        listTitle.innerText = "Unknown Faces";
        listContent.innerHTML = "";
        for (let i = 1; i <= unknown; i++) {
            const li = document.createElement("li");
            li.innerText = `Unknown Person ${i}`;
            listContent.appendChild(li);
        }
    };
});
// Show logs if available
const logOutput = document.getElementById("log-output");
if (data.logs && Array.isArray(data.logs)) {
    logOutput.innerText = data.logs.join("\n");
} else {
    logOutput.innerText = "No logs available.";
}
