export const TotalXpChart = async(dataArray, frequency, lineCount, totalUserXp) => {
    const svgParent = document.getElementById("all-graphs");
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttributeNS(null, "id", "total-xp-chart");
    svgElement.setAttributeNS(null, "class", "total-xp-chart");
    let svgCard = document.createElementNS("http://www.w3.org/2000/svg", "text");
    svgCard.id = "graph-card";
    svgCard.setAttributeNS(null, "class", "graph-card");

    // make variables to scale different users
    let barWidth =
        Math.floor(600 / dataArray.length) -
        2 *
        parseInt(
            Math.floor(600 / dataArray.length)
            .toString()
            .slice(0, 1)
        );
    let divider = 2000;
    let ratio = 2;
    let legendFontSize = 22;
    let cardFontSize = 16;
    let cardNewLine = 20;
    let cardYoffset = 45;
    let rectHeigh = 45;
    let rectWidth = 180;
    let rectYoffset = 65;

    if (dataArray.length > 25) {
        frequency = 25;
        divider = 7500;
        ratio = 7.5;
        frequency = 20;
        legendFontSize = 22;
    }
    if (dataArray.length > 35) {
        frequency = 25;
        divider = 7500;
        ratio = 7.5;
        frequency = 20;
        legendFontSize = 26;
        cardFontSize = 26;
        rectHeigh = 60;
        rectWidth = 280;
        rectYoffset = 72;
    }
    if (dataArray.length > 50) {
        frequency = 20;
        divider = 15000;
        ratio = 15;
        frequency = 10;
    }

    // const maxVal = totalUserXp / divider;
    const widthSvg = dataArray.length * frequency;
    const heightSvg = widthSvg + 50;
    const graphLine = Math.ceil(widthSvg / (lineCount - 1));
    // set up viewbox
    svgElement.setAttributeNS(null, "viewBox", "0 0 " + widthSvg + " " + (heightSvg + 40));

    let totalXp = 0;
    let cumulativeXp = 0;
    for (let i = 0; i < dataArray.length; i++) {
        const rectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        totalXp += dataArray[i].amount / divider;
        const xValue = i * frequency;
        const yValue = heightSvg - totalXp;

        rectElement.setAttributeNS(null, "x", xValue);
        rectElement.setAttributeNS(null, "y", yValue);
        rectElement.setAttributeNS(null, "height", totalXp);
        rectElement.setAttributeNS(null, "width", barWidth);
        rectElement.setAttributeNS(null, "fill", "lightblue");
        rectElement.setAttributeNS(null, "stroke", "black");
        rectElement.setAttributeNS(null, "stroke-width", "1");

        rectElement.addEventListener("mouseover", () => {
            // make a background box for data card
            let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttributeNS(null, "x", xValue - 105);
            rect.setAttributeNS(null, "y", yValue - rectYoffset);
            rect.setAttributeNS(null, "width", rectWidth);
            rect.setAttributeNS(null, "height", rectHeigh);
            rect.setAttributeNS(null, "fill", "white");
            rect.setAttributeNS(null, "stroke", "black");
            rect.setAttributeNS(null, "stroke-width", "1");

            // make data card
            let tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            for (let j = 0; j <= i; j++) {
                cumulativeXp += dataArray[j].amount;
            }
            svgCard.innerHTML = "Cumulative XP: " + cumulativeXp;
            svgCard.setAttributeNS(null, "x", xValue - 100);
            svgCard.setAttributeNS(null, "dy", yValue - cardYoffset);
            svgCard.setAttributeNS(null, "font-size", cardFontSize);
            tspan.innerHTML =
                "Date: " + dataArray[i].createdAt.slice(0, 10).replaceAll("-", ".").split(".").reverse().join(".");
            tspan.setAttributeNS(null, "x", xValue - 100);
            tspan.setAttributeNS(null, "dy", cardNewLine);
            svgCard.appendChild(tspan);
            svgElement.insertBefore(rect, svgCard);
            rectElement.addEventListener("mouseleave", () => {
                svgCard.innerHTML = "";
                rect.remove();
                cumulativeXp = 0;
            });
        });

        svgElement.appendChild(rectElement);
    }

    // make g tag for grouping other tags
    const gElementLine = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gElementLine.id = "graph-line";
    gElementLine.setAttributeNS(null, "class", "graph-line");
    const gElementText = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gElementText.id = "graph-text";
    gElementText.setAttributeNS(null, "class", "graph-text");

    const xLegend = document.createElementNS("http://www.w3.org/2000/svg", "text");
    const xData = "Time";
    xLegend.setAttributeNS(null, "dx", "50%");
    xLegend.setAttributeNS(null, "y", heightSvg + 30);
    xLegend.setAttributeNS(null, "font-size", legendFontSize);
    xLegend.setAttributeNS(null, "text-anchor", "middle");
    xLegend.textContent = xData;
    gElementText.appendChild(xLegend);

    const yLegend = document.createElementNS("http://www.w3.org/2000/svg", "text");
    const yData = "Total XP";
    yLegend.setAttributeNS(null, "x", -heightSvg / 2);
    yLegend.setAttributeNS(null, "y", "-60");
    yLegend.setAttributeNS(null, "font-size", legendFontSize);
    yLegend.setAttributeNS(null, "transform", "rotate(-90)");
    yLegend.setAttributeNS(null, "text-anchor", "middle");
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

    svgElement.appendChild(gElementLine);
    svgElement.appendChild(gElementText);
    svgElement.appendChild(svgCard);
    svgParent.appendChild(svgElement);
};