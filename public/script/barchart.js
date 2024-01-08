


let month = document.getElementById('month').value.split(',');
let total_idea_month = document.getElementById('total_idea_month').value.split(',').map(Number);
var ctx = document.getElementById("myBarChart");
var myBarChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: month,
    datasets: [{
      label: "Posts",
      backgroundColor: "#4e73df",
      hoverBackgroundColor: "#2e59d9",
      borderColor: "#4e73df",
      data: total_idea_month,
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'month'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 12
        },
        maxBarThickness: 25,
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: Math.max(...total_idea_month),
          maxTicksLimit: 8,
          padding: 10,
          callback: function(value, index, values) {
            return ' '+ value.toLocaleString();
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ' ' + tooltipItem.yLabel.toLocaleString();
        }
      }
    },
  }
});



socket.on('total_idea_month', (data)=>{
  myBarChart.data.labels = data.month;
  myBarChart.data.datasets[0].data = data.total_idea_month;
  myBarChart.options.scales.yAxes[0].ticks.max = Math.max(...data.total_idea_month);
  myBarChart.update();
});
