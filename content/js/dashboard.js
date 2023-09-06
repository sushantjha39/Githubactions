/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 70.58823529411765, "KoPercent": 29.41176470588235};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6176470588235294, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Creates/updates family history record"], "isController": false}, {"data": [1.0, 500, 1500, "Returns list of patients upcoming appointments"], "isController": false}, {"data": [1.0, 500, 1500, "Creates progress note for an appointment"], "isController": false}, {"data": [1.0, 500, 1500, "Get all Patient details"], "isController": false}, {"data": [1.0, 500, 1500, "Creates/updates medication history record"], "isController": false}, {"data": [1.0, 500, 1500, "Creates/updates risk factor record"], "isController": false}, {"data": [1.0, 500, 1500, "Creates/updates prior dx record"], "isController": false}, {"data": [1.0, 500, 1500, "Returns list of patients upcoming appointments-0"], "isController": false}, {"data": [0.5, 500, 1500, "Health Facility Admin Login"], "isController": false}, {"data": [0.0, 500, 1500, "Calculates guidances for an appointment"], "isController": false}, {"data": [1.0, 500, 1500, "Creates/updates test record"], "isController": false}, {"data": [0.0, 500, 1500, "Get Patient details"], "isController": false}, {"data": [0.0, 500, 1500, "Creates new appointment for patient for given date and time"], "isController": false}, {"data": [1.0, 500, 1500, "Pharmacist Login"], "isController": false}, {"data": [0.0, 500, 1500, "Creates/updates tobacco cessation record"], "isController": false}, {"data": [0.0, 500, 1500, "Creates/updates allergy record"], "isController": false}, {"data": [1.0, 500, 1500, "Add/Updates diagnosis"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 17, 5, 29.41176470588235, 932.0588235294117, 3, 9687, 256.0, 3630.9999999999945, 9687.0, 9687.0, 1.0718789407313998, 1.4788210316834804, 0.7553273762610341], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Creates/updates family history record", 1, 1, 100.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 3.1348476890756305, 3.2702534138655466], "isController": false}, {"data": ["Returns list of patients upcoming appointments", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 10.198912116040956, 1.9364601109215018], "isController": false}, {"data": ["Creates progress note for an appointment", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 2.984375, 2.60546875], "isController": false}, {"data": ["Get all Patient details", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 19.208262402723737, 2.1735165369649807], "isController": false}, {"data": ["Creates/updates medication history record", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 2.984375, 4.4921875], "isController": false}, {"data": ["Creates/updates risk factor record", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 2.972485059760956, 6.47410358565737], "isController": false}, {"data": ["Creates/updates prior dx record", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.9489871541501977, 3.9294095849802373], "isController": false}, {"data": ["Returns list of patients upcoming appointments-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 699.5442708333334, 0.0], "isController": false}, {"data": ["Health Facility Admin Login", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 2.7711138464630225, 0.43332998392282956], "isController": false}, {"data": ["Calculates guidances for an appointment", 1, 1, 100.0, 9687.0, 9687, 9687, 9687.0, 9687.0, 9687.0, 9687.0, 0.10323113451016827, 0.09153698255393827, 0.06683812712914215], "isController": false}, {"data": ["Creates/updates test record", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 3.0206224696356276, 4.471628289473684], "isController": false}, {"data": ["Get Patient details", 1, 1, 100.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 5.771636962890625, 2.208709716796875], "isController": false}, {"data": ["Creates new appointment for patient for given date and time", 1, 1, 100.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 3.4552421278625953, 2.5084983301526718], "isController": false}, {"data": ["Pharmacist Login", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 5.022321428571428, 0.7744169096209912], "isController": false}, {"data": ["Creates/updates tobacco cessation record", 1, 0, 0.0, 2117.0, 2117, 2117, 2117.0, 2117.0, 2117.0, 2117.0, 0.4723665564478035, 0.3524297354747284, 0.3874881908360888], "isController": false}, {"data": ["Creates/updates allergy record", 1, 1, 100.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 3.1480748945147683, 2.8184335443037978], "isController": false}, {"data": ["Add/Updates diagnosis", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 2.674171146953405, 2.450156810035842], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["501", 1, 20.0, 5.882352941176471], "isController": false}, {"data": ["403", 2, 40.0, 11.764705882352942], "isController": false}, {"data": ["409", 1, 20.0, 5.882352941176471], "isController": false}, {"data": ["The result was the wrong size: It was 1,513 bytes, but should have been equal to 1,764 bytes.", 1, 20.0, 5.882352941176471], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 17, 5, "403", 2, "501", 1, "409", 1, "The result was the wrong size: It was 1,513 bytes, but should have been equal to 1,764 bytes.", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Creates/updates family history record", 1, 1, "403", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Calculates guidances for an appointment", 1, 1, "501", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Patient details", 1, 1, "The result was the wrong size: It was 1,513 bytes, but should have been equal to 1,764 bytes.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Creates new appointment for patient for given date and time", 1, 1, "409", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Creates/updates allergy record", 1, 1, "403", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
