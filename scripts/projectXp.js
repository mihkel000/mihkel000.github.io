export const ProjectXpChart = async(dataArray, frequency, lineCount) => {
    const svgParent = document.getElementById("all-graphs");

    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttributeNS(null, "id", "project-xp-chart");
    svgElement.setAttributeNS(null, "class", "project-xp-chart");

    let svgCard = document.createElementNS("http://www.w3.org/2000/svg", "text");
    svgCard.id = "graph-card";
    svgCard.setAttributeNS(null, "class", "graph-card");

    const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svgPath.setAttributeNS(null, "class", "graph-path");

    // make variables to scale different users
    let divider = 1000;
    let ratio = 1;
    let circleRadius = 6;
    let legendFontSize = 18;
    let cardFontSize = 16;
    let cardNewLine = 20;
    let cardYoffset = 90;
    let rectHeigh = 90;
    let rectWidth = 4;
    let rectYoffset = 110;
    if (dataArray.length > 20) {
        divider = 1000;
        ratio = 1;
        legendFontSize = 32;
        circleRadius = 8;
        cardFontSize = 24;
        cardNewLine = 26;
        cardYoffset = 100;
        rectHeigh = 110;
        rectWidth = 6;
        rectYoffset = 125;
    }
    if (dataArray.length > 30) {
        divider = 2000;
        ratio = 2;
        frequency = 25;
        legendFontSize = 34;
        circleRadius = 8;
        cardFontSize = 34;
        cardNewLine = 26;
        cardYoffset = 100;
        rectHeigh = 120;
        rectWidth = 9;
        rectYoffset = 130;
    }
    if (dataArray.length > 50) {
        frequency = 20;
    }

    // const maxVal = Math.max(...dataArray.map((max) => max.amount)) / divider;
    const widthSvg = dataArray.length * frequency - frequency;
    const heightSvg = widthSvg + 130;
    const graphLine = Math.ceil(widthSvg / (lineCount - 1));
    // set up viewbox
    svgElement.setAttributeNS(null, "viewBox", "0 0 " + widthSvg + " " + (heightSvg + 40));

    // make g tag for grouping other tags
    const gElementCircle = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gElementCircle.id = "graph-circle";
    gElementCircle.setAttributeNS(null, "class", "graph-circle");
    const gElementLine = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gElementLine.id = "graph-line";
    gElementLine.setAttributeNS(null, "class", "graph-line");
    const gElementText = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gElementText.id = "graph-text";
    gElementText.setAttributeNS(null, "class", "graph-text");

    // make graph base line and adding circles
    let pathString = "M" + widthSvg + " " + heightSvg + " " + "L" + 0 + " " + heightSvg;
    for (let i = 0; i < dataArray.length; i++) {
        // base line
        const yValue = heightSvg - dataArray[i].amount / divider;
        const xValue = i * frequency;
        const lineString = " L" + xValue + " " + yValue;
        pathString += lineString;

        // circle
        const circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circleElement.setAttributeNS(null, "cx", xValue);
        circleElement.setAttributeNS(null, "cy", yValue);
        circleElement.setAttributeNS(null, "r", circleRadius);
        circleElement.addEventListener("mouseover", () => {
            // make a background box for data card
            let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttributeNS(null, "x", xValue - 105);
            rect.setAttributeNS(null, "y", yValue - rectYoffset);
            rect.setAttributeNS(null, "width", (35 + dataArray[i].object.name.length) * rectWidth);
            rect.setAttributeNS(null, "height", rectHeigh);
            rect.setAttributeNS(null, "fill", "white");
            rect.setAttributeNS(null, "stroke", "black");
            rect.setAttributeNS(null, "stroke-width", "1");

            // make data card
            let tspan1 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            let tspan2 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            let tspan3 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            svgCard.innerHTML = "Task: " + dataArray[i].object.name;
            svgCard.setAttributeNS(null, "x", xValue - 100);
            svgCard.setAttributeNS(null, "dy", yValue - cardYoffset);
            svgCard.setAttributeNS(null, "font-size", cardFontSize);
            tspan1.innerHTML = "Type: " + dataArray[i].object.type;
            tspan1.setAttributeNS(null, "x", xValue - 100);
            tspan1.setAttributeNS(null, "dy", cardNewLine);
            tspan2.innerHTML = "XP: " + dataArray[i].amount;
            tspan2.setAttributeNS(null, "x", xValue - 100);
            tspan2.setAttributeNS(null, "dy", cardNewLine);
            tspan3.innerHTML =
                "Date: " + dataArray[i].createdAt.slice(0, 10).replaceAll("-", ".").split(".").reverse().join(".");
            tspan3.setAttributeNS(null, "x", xValue - 100);
            tspan3.setAttributeNS(null, "dy", cardNewLine);
            svgCard.append(tspan1, tspan2, tspan3);
            svgElement.insertBefore(rect, svgCard);
            circleElement.addEventListener("mouseleave", () => {
                svgCard.innerHTML = "";
                rect.remove();
            });
        });
        gElementCircle.appendChild(circleElement);
    }

    // base line ending
    const ending = heightSvg - dataArray[dataArray.length - 1].amount / divider;
    pathString += " L" + widthSvg + " " + ending;
    pathString += " Z";
    svgPath.setAttributeNS(null, "d", pathString);

    const xLegend = document.createElementNS("http://www.w3.org/2000/svg", "text");
    const xData = "Time";
    xLegend.setAttributeNS(null, "dx", "0");
    xLegend.setAttributeNS(null, "x", widthSvg / 2);
    xLegend.setAttributeNS(null, "y", heightSvg + 30);
    xLegend.setAttributeNS(null, "font-size", legendFontSize);
    xLegend.textContent = xData;
    gElementText.appendChild(xLegend);

    const yLegend = document.createElementNS("http://www.w3.org/2000/svg", "text");
    const yData = "Project XP";
    yLegend.setAttributeNS(null, "dx", "0");
    yLegend.setAttributeNS(null, "x", -heightSvg / 2);
    yLegend.setAttributeNS(null, "y", "-70");
    yLegend.setAttributeNS(null, "font-size", legendFontSize);
    yLegend.setAttributeNS(null, "transform", "rotate(-90)");
    yLegend.textContent = yData;
    gElementText.appendChild(yLegend);

    // adding lines and texts
    for (let i = 0; i < lineCount; i++) {
        const lineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
        const yPosition = heightSvg - i * graphLine;
        lineElement.setAttributeNS(null, "x1", "0");
        lineElement.setAttributeNS(null, "y1", yPosition);
        lineElement.setAttributeNS(null, "x2", widthSvg);
        lineElement.setAttributeNS(null, "y2", yPosition);
        gElementLine.appendChild(lineElement);

        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        const textData = i * graphLine * ratio;
        textElement.setAttributeNS(null, "dx", "0");
        textElement.setAttributeNS(null, "x", -20);
        textElement.setAttributeNS(null, "y", yPosition);
        textElement.setAttributeNS(null, "font-size", legendFontSize);
        textElement.textContent = textData;
        gElementText.appendChild(textElement);
    }

    // the order matters to tell which object is in the background and what is in the front
    svgElement.appendChild(svgPath);
    svgElement.appendChild(gElementLine);
    svgElement.appendChild(gElementText);
    svgElement.appendChild(gElementCircle);
    svgElement.appendChild(svgCard);
    svgParent.appendChild(svgElement);
};