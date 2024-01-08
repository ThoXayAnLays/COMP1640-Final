// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// Pie Chart Example

var ctx = document.getElementById("myPieChart");
let all_department = document.getElementById("all_department").value;
all_department = all_department.split(",");

let total_idea_department = document.getElementById("total_idea_department").value;
total_idea_department = total_idea_department.split(",");

let sum = 0;
for (let i = 0; i < total_idea_department.length; i++) {
  sum += parseInt(total_idea_department[i]);
}

for (let i = 0; i < total_idea_department.length; i++) {
  total_idea_department[i] = Math.round(parseInt(total_idea_department[i]) / sum * 100);
}



var myPieChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: all_department,
    datasets: [{
      data: total_idea_department,
      backgroundColor: ['#4e73df', '#1cc88a', '#2c9faf', '#e74a3b'],
      hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
    },
    legend: {
      display: false
    },
    cutoutPercentage: 80,
  },
});


