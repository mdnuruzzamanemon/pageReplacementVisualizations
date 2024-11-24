// script.js
function visualize() {
    const algorithm = document.getElementById("algorithm").value;
    const blockSizes = document.getElementById("blockSizes").value.split(",").map(Number);
    const processSizes = document.getElementById("processSizes").value.split(",").map(Number);
  
    document.getElementById("visualization").innerHTML = ""; // Clear previous visualization
  
    switch (algorithm) {
      case "firstFit":
        visualizeFirstFit(blockSizes, processSizes);
        break;
      case "bestFit":
        visualizeBestFit(blockSizes, processSizes);
        break;
      case "worstFit":
        visualizeWorstFit(blockSizes, processSizes);
        break;
      case "nextFit":
        visualizeNextFit(blockSizes, processSizes);
        break;
      default:
        alert("Invalid algorithm selected");
    }
  }
  
  function createTable(blockSizes, processSizes) {
    const table = document.createElement("table");
    table.className = "table";
  
    const headerRow = table.insertRow();
    headerRow.innerHTML = `
      <th>Process</th>
      <th>Size</th>
      <th>Block Allocated</th>
    `;
  
    processSizes.forEach((size, index) => {
      const row = table.insertRow();
      row.innerHTML = `
        <td>Process ${index + 1}</td>
        <td>${size}</td>
        <td id="block${index}">Not Allocated</td>
      `;
    });
  
    document.getElementById("visualization").appendChild(table);
    return table;
  }
  
  function createMemoryStatusTable(blockSizes) {
    const memoryTable = document.createElement("table");
    memoryTable.className = "table";
    memoryTable.id = "memoryStatus";
  
    const headerRow = memoryTable.insertRow();
    headerRow.innerHTML = `
      <th>Block</th>
      ${blockSizes.map((_, i) => `<th>Block ${i + 1}</th>`).join("")}
    `;
  
    const statusRow = memoryTable.insertRow();
    statusRow.id = "memoryStatusRow";
    statusRow.innerHTML = `
      <td>Remaining Size</td>
      ${blockSizes.map((size) => `<td>${size}</td>`).join("")}
    `;
  
    document.getElementById("visualization").appendChild(memoryTable);
  }
  
  function updateMemoryStatus(blockSizes) {
    const statusRow = document.getElementById("memoryStatusRow");
    if (statusRow) {
      statusRow.innerHTML = `
        <td>Remaining Size</td>
        ${blockSizes.map((size) => `<td>${size}</td>`).join("")}
      `;
    }
  }
  
  function visualizeFirstFit(blockSizes, processSizes) {
    const table = createTable(blockSizes, processSizes);
    createMemoryStatusTable([...blockSizes]);
  
    processSizes.forEach((process, i) => {
      for (let j = 0; j < blockSizes.length; j++) {
        if (blockSizes[j] >= process) {
          blockSizes[j] -= process;
          table.rows[i + 1].cells[2].textContent = `Block ${j + 1}`;
          table.rows[i + 1].cells[2].className = "hit";
          updateMemoryStatus(blockSizes);
          return;
        }
      }
      table.rows[i + 1].cells[2].className = "miss";
    });
  }
  
  function visualizeBestFit(blockSizes, processSizes) {
    const table = createTable(blockSizes, processSizes);
    createMemoryStatusTable([...blockSizes]);
  
    processSizes.forEach((process, i) => {
      let bestIndex = -1;
      for (let j = 0; j < blockSizes.length; j++) {
        if (blockSizes[j] >= process && (bestIndex === -1 || blockSizes[j] < blockSizes[bestIndex])) {
          bestIndex = j;
        }
      }
  
      if (bestIndex !== -1) {
        blockSizes[bestIndex] -= process;
        table.rows[i + 1].cells[2].textContent = `Block ${bestIndex + 1}`;
        table.rows[i + 1].cells[2].className = "hit";
        updateMemoryStatus(blockSizes);
      } else {
        table.rows[i + 1].cells[2].className = "miss";
      }
    });
  }
  
  function visualizeWorstFit(blockSizes, processSizes) {
    const table = createTable(blockSizes, processSizes);
    createMemoryStatusTable([...blockSizes]);
  
    processSizes.forEach((process, i) => {
      let worstIndex = -1;
      for (let j = 0; j < blockSizes.length; j++) {
        if (blockSizes[j] >= process && (worstIndex === -1 || blockSizes[j] > blockSizes[worstIndex])) {
          worstIndex = j;
        }
      }
  
      if (worstIndex !== -1) {
        blockSizes[worstIndex] -= process;
        table.rows[i + 1].cells[2].textContent = `Block ${worstIndex + 1}`;
        table.rows[i + 1].cells[2].className = "hit";
        updateMemoryStatus(blockSizes);
      } else {
        table.rows[i + 1].cells[2].className = "miss";
      }
    });
  }
  
  function visualizeNextFit(blockSizes, processSizes) {
    const table = createTable(blockSizes, processSizes);
    createMemoryStatusTable([...blockSizes]);
    let pointer = 0;
  
    processSizes.forEach((process, i) => {
      let start = pointer;
      do {
        if (blockSizes[pointer] >= process) {
          blockSizes[pointer] -= process;
          table.rows[i + 1].cells[2].textContent = `Block ${pointer + 1}`;
          table.rows[i + 1].cells[2].className = "hit";
          updateMemoryStatus(blockSizes);
          pointer = (pointer + 1) % blockSizes.length;
          return;
        }
        pointer = (pointer + 1) % blockSizes.length;
      } while (pointer !== start);
  
      table.rows[i + 1].cells[2].className = "miss";
    });
  }
  