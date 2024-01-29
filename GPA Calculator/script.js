$(document).ready(function () {
    
    // Table class constructor
    function Table(tableId) {
        this.tableId = tableId;
        this.inputs = $(`#${tableId} input`);
        this.table = null;
    }

    // Table class methods

    Table.prototype.createTable = function () {
        // Create a new table element
        this.table = $('<table>').addClass('table-container').attr('id', this.tableId);
    
        // Create the first row with a colspan of 3
        var firstRow = $('<tr>').appendTo(this.table);
        var cell = $('<td>').attr('colspan', 3).addClass('border-bottom1').appendTo(firstRow);
        $('<input>').attr('type', 'text').addClass('table-header').val('CMN 300').appendTo(cell);
    
        // Create the second row with table headers
        var secondRow = $('<tr>').appendTo(this.table);
        $('<th>').addClass('sub-header border-right').text('Item').appendTo(secondRow);
        $('<th>').addClass('sub-header border-right').text('Mark(%)').appendTo(secondRow);
        $('<th>').addClass('sub-header').text('Weight(%)').appendTo(secondRow);
    
        // Add eight rows dynamically
        for (let i = 0; i < 8; ++i) {
            var newRow = $('<tr>').appendTo(this.table);
            $('<td>').addClass('leftCol-border cellItem').append($('<input>').attr('type', 'text')).appendTo(newRow);
            $('<td>').addClass('middleCol-border cellMark').append($('<input>').attr('type', 'text')).appendTo(newRow);
            $('<td>').addClass('rightCol-border cellWeight').append($('<input>').attr('type', 'text')).appendTo(newRow);
        }

        // Add the remaining rows
        this.table.append('<tr><td class="pad"></td></tr>' +
            '<tr><td rowspan="3" class="border-top1 border-right lightblue">Course Summary</td>' +
            '<td class="border-top1 blue">Average Mark(%):</td>' +
            '<td class="border-top1 blue left" id="coursePercent">0%</td></tr>' +
            '<tr><td class="border-top1 blue">Grade Point: </td>' +
            '<td class="border-top1 blue" id="numGrade">0.00</td></tr>' +
            '<tr> <td class="border-top1 blue" >Letter Grade:</td>'+
            '<td class="border-top1 blue" id="letterGrade"> F</td></tr>');
    
        // Append the table to the body
        $('body').append(this.table);
        
    };

    Table.prototype.handleArrowNavigation = function (event) {
        const currentInput = $(':focus');
        this.inputs = $(`#${this.tableId} input`);

        let index = this.inputs.index(currentInput);
        console.log("index is" +index + this.inputs.index);
        if (index !== -1) {
            switch (event.key) {
                case 'ArrowUp':
                    index = Math.max(0, index - 3);
                    break;
                case 'ArrowDown':
                    index = Math.min(this.inputs.length - 1, index + 3);
                    break;
                case 'ArrowLeft':
                    index = Math.max(0, index - 1);
                    break;
                case 'ArrowRight':
                    index = Math.min(this.inputs.length - 1, index + 1);
                    break;
                default:
                    return;
            }
    
            this.inputs.eq(index).focus();
        } 
    };
    
    Table.prototype.bindEvents = function () {
        var that = this; 

        $(document).keydown(function (event) {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Enter') {
                that.handleArrowNavigation(event);
                event.preventDefault(); // Prevent the default behavior of arrow keys and Enter key
            }
        });

        this.table.on("input", ".cellMark input, .cellWeight input", function () {
            that.updateCoursePercentage();
        });

        $("#resetButton").click(function () {
            // Reset all input fields
            that.table.find("input[type='text']").val("");
            that.updateCoursePercentage(); // Update percentage after resetting
        });

        $("#deleteTablesButton").click(function () {
            that.table.remove();
        });
    };

    Table.prototype.updateCoursePercentage = function () {
        let totalMark = 0;
        let totalWeight = 0;

        this.table.find(".cellMark input").each(function (index) {
            let mark = parseFloat($(this).val()) || 0;
            let weight = parseFloat($(this).closest('table').find(".cellWeight input").eq(index).val()) || 0;

            totalMark += mark / 100 * weight;
        });

        let coursePercentage = totalMark;
        this.table.find("#coursePercent").text(coursePercentage.toFixed(1) + "%");
        this.gradePoint(Math.round(totalMark, 0));
        
    };

    Table.prototype.gradePoint = function (num) {
        var $numGrade = $("#" + this.tableId + " #numGrade");
        var $letterGrade = $("#" + this.tableId + " #letterGrade");
    
        if (num >= 90) {
            $numGrade.text("4.33");
            $letterGrade.text("A+");
        } else if (num >= 85) {
            $numGrade.text("4.00");
            $letterGrade.text("A");
        } else if (num >= 80) {
            $numGrade.text("3.67");
            $letterGrade.text("A-");
        } else if (num >= 77) {
            $numGrade.text("3.33");
            $letterGrade.text("B+");
        } else if (num >= 73) {
            $numGrade.text("3.00");
            $letterGrade.text("B");
        } else if (num >= 70) {
            $numGrade.text("2.67");
            $letterGrade.text("B-");
        } else if (num >= 67) {
            $numGrade.text("2.33");
            $letterGrade.text("C+");
        } else if (num >= 63) {
            $numGrade.text("2.00");
            $letterGrade.text("C");
        } else if (num >= 60) {
            $numGrade.text("1.67");
            $letterGrade.text("C-");
        } else if (num >= 57) {
            $numGrade.text("1.33");
            $letterGrade.text("D+");
        } else if (num >= 53) {
            $numGrade.text( "1.00");
            $letterGrade.text( "D");
        } else if (num >= 50) {
            $numGrade.text("0.67");
            $letterGrade.text("D-");
        } else {
            $numGrade.text("0.00");
            $letterGrade.text("F");
        }
    };



    $("#addTable").click(function () {
        var referenceNode = document.getElementById("finalSummary");
        var newTable = new Table("table_" + Date.now());
        newTable.createTable();
        newTable.bindEvents();
        newTable.table.insertBefore("#finalSummary");
    });

    //1 table displayed by default
    var initialTable = new Table("table_" + Date.now());
    initialTable.createTable();
    initialTable.bindEvents();
    initialTable.table.insertBefore("#finalSummary");

    function CalculateFinal() {
        // FinalSummary Table 
        let totalAverageMark = 0;
        let totalAverageGPA =0;
        let numberOfTables = 0;
    
        // Iterate through each table
        $(".table-container").each(function () {

    
            var coursePercentValue = parseFloat($(this).find("#coursePercent").text());
            var GPAValue = parseFloat($(this).find("#numGrade").text());

    
            totalAverageMark += coursePercentValue;
            totalAverageGPA += GPAValue;
            numberOfTables++;
    
        });
    
        // Calculate the overall average
        let finalAverage = totalAverageMark / numberOfTables;
        let gpaup= totalAverageGPA/numberOfTables;

        // Update the final summary table with the overall average
        $("#finalPercent").text(finalAverage.toFixed(2) + "%");
        $("#finalGPA").text(gpaup);

    }

    // Run the CalculateFinal function every time there is an input
    $(document).on("input", ".table-container .cellMark input, .table-container .cellWeight input", function () {
        CalculateFinal();
    });


});
