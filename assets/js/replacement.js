// document.getElementById("input-form").addEventListener("submit", function (e) {
//     e.preventDefault();
function visualize() {
    const algorithm = document.getElementById("algorithm").value;
    const frames = parseInt(document.getElementById("frames").value, 10);
    const sequence = document.getElementById("sequence").value.split(",").map(Number);
  
    const visualizationDiv = document.getElementById("visualization");
    visualizationDiv.innerHTML = ""; // Clear previous visualization
  
    switch (algorithm) {
      case "FIFO":
        visualizeFIFO(frames, sequence);
        break;
      case "OPTIMAL":
        visualizeOptimal(frames, sequence);
        break;
      case "LRU":
        visualizeLRU(frames, sequence);
        break;
      case "CLOCK":
        visualizeClock(frames, sequence);
        break;
      default:
        alert("Invalid algorithm selected.");
    }
  }
  // });
  
  function createTable(frames, sequence) {
    const table = document.createElement("table");
    const headerRow = document.createElement("tr");
  
    headerRow.innerHTML = `<th>Step</th>${sequence.map((p) => `<th>${p}</th>`).join("")}`;
    table.appendChild(headerRow);
  
    for (let i = 0; i < frames; i++) {
      const row = document.createElement("tr");
      row.innerHTML = `<td>Frame ${i + 1}</td>${sequence.map(() => `<td></td>`).join("")}`;
      table.appendChild(row);
    }
  
    const statusRow = document.createElement("tr");
    statusRow.innerHTML = `<td>Status</td>${sequence.map(() => `<td></td>`).join("")}`;
    table.appendChild(statusRow);
  
    return table;
  }
  
  function visualizeFIFO(frames, sequence) {
    const table = createTable(frames, sequence);
    const frameArray = [];
    let statusRow = table.rows[frames + 1];
  
    sequence.forEach((page, step) => {
      const frameHit = frameArray.includes(page);
  
      if (!frameHit) {
        if (frameArray.length >= frames) {
          frameArray.shift(); // Remove oldest
        }
        frameArray.push(page);
      }
  
      for (let i = 0; i < frames; i++) {
        table.rows[i + 1].cells[step + 1].textContent = frameArray[i] ?? "";
        table.rows[i + 1].cells[step + 1].className = frameArray[i] === page && frameHit ? "hit" : "miss";
      }
  
      statusRow.cells[step + 1].textContent = frameHit ? "HIT" : "MISS";
      statusRow.cells[step + 1].className = frameHit ? "hit" : "miss";
    });
  
    document.getElementById("visualization").appendChild(table);
  }
  
  
  function visualizeOptimal(frames, sequence) {
    const table = createTable(frames, sequence);
    const frameArray = [];
    let statusRow = table.rows[frames + 1];
  
    sequence.forEach((page, step) => {
      const frameHit = frameArray.includes(page);
  
      if (!frameHit) {
        if (frameArray.length >= frames) {
          // Find the page that will not be used for the longest time
          let farthest = -1;
          let replaceIndex = 0;
  
          for (let i = 0; i < frameArray.length; i++) {
            const nextIndex = sequence.slice(step + 1).indexOf(frameArray[i]);
            if (nextIndex === -1) {
              replaceIndex = i;
              break;
            }
            if (nextIndex > farthest) {
              farthest = nextIndex;
              replaceIndex = i;
            }
          }
  
          frameArray[replaceIndex] = page;
        } else {
          frameArray.push(page);
        }
      }
  
      for (let i = 0; i < frames; i++) {
        table.rows[i + 1].cells[step + 1].textContent = frameArray[i] ?? "";
        table.rows[i + 1].cells[step + 1].className = frameArray[i] === page && frameHit ? "hit" : "miss";
      }
  
      statusRow.cells[step + 1].textContent = frameHit ? "HIT" : "MISS";
      statusRow.cells[step + 1].className = frameHit ? "hit" : "miss";
    });
  
    document.getElementById("visualization").appendChild(table);
  }

  


  function visualizeLRU(frames, sequence) {
    const table = createTable(frames, sequence);
    const frameArray = [];
    const lastUsed = new Map(); // To track the last used time of each page
    let statusRow = table.rows[frames + 1];
  
    sequence.forEach((page, step) => {
      const frameHit = frameArray.includes(page);
  
      if (!frameHit) {
        if (frameArray.length >= frames) {
          // Find the least recently used page
          let lruPage = frameArray.reduce((least, current) => 
            lastUsed.get(current) < lastUsed.get(least) ? current : least
          );
  
          const replaceIndex = frameArray.indexOf(lruPage);
          frameArray[replaceIndex] = page;
        } else {
          frameArray.push(page);
        }
      }
  
      lastUsed.set(page, step);
  
      for (let i = 0; i < frames; i++) {
        table.rows[i + 1].cells[step + 1].textContent = frameArray[i] ?? "";
        table.rows[i + 1].cells[step + 1].className = frameArray[i] === page && frameHit ? "hit" : "miss";
      }
  
      statusRow.cells[step + 1].textContent = frameHit ? "HIT" : "MISS";
      statusRow.cells[step + 1].className = frameHit ? "hit" : "miss";
    });
  
    document.getElementById("visualization").appendChild(table);
  }


  
  function visualizeClock(frames, sequence) {
    const table = createTable(frames, sequence);
    const frameArray = Array(frames).fill(null); // Holds the pages in frames
    const useBit = Array(frames).fill(0); // Tracks the use bit for each frame
    let pointer = 0; // Points to the current position in the circular buffer
    let statusRow = table.rows[frames + 1];
  
    sequence.forEach((page, step) => {
      const frameHit = frameArray.includes(page);
  
      if (!frameHit) {
        while (useBit[pointer] === 1) {
          useBit[pointer] = 0; // Reset use bit
          pointer = (pointer + 1) % frames; // Move pointer in circular fashion
        }
  
        // Replace the page at the pointer
        frameArray[pointer] = page;
        useBit[pointer] = 1; // Set the use bit for the new page
        pointer = (pointer + 1) % frames; // Move pointer to next position
      } else {
        // Set use bit for the accessed page
        const index = frameArray.indexOf(page);
        useBit[index] = 1;
      }
  
      // Update the table for visualization
      for (let i = 0; i < frames; i++) {
        table.rows[i + 1].cells[step + 1].textContent = frameArray[i] ?? "";
        table.rows[i + 1].cells[step + 1].className = frameArray[i] === page && frameHit ? "hit" : "miss";
      }
  
      statusRow.cells[step + 1].textContent = frameHit ? "HIT" : "MISS";
      statusRow.cells[step + 1].className = frameHit ? "hit" : "miss";
    });
  
    document.getElementById("visualization").appendChild(table);
  }
  
  