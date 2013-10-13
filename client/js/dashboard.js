var AD = {
  Graph: Graph,
  Table: Table
};


function Graph(options){
  var self = this;
  self._conn = io.connect('http://localhost:8080/queues');

  self._conn.on('connect', function(){
    self._conn.emit('requestHistoricalQueue', 10002, 20);
  });

  var chart;

  self._conn.on('historical', function(queue, points){
    //cheating for the time being - ONLY changing current calls

    //check if options.container exists
    if(options.container){
      if(!document.getElementById(options.container)){
        var g = document.createElement('div');
        g.setAttribute('id', options.container);
        document.getElementsByTagName('body')[0].appendChild(g);
      }
    }else{
      throw new Error('No container specified');
    }

    if(points.currentCalls && points.currentCalls.length){
      var chartPoints = [];
      points.currentCalls.forEach(function(point){
        chartPoints.push([new Date(point.date), point.value/1]);
      });
      chart = new Highcharts.Chart({
        chart: {
          type: 'spline',
          renderTo: options.container,
          zoomType: 'x',
          spacingRight: 20
        },
        title: {
          text: 'Calls in queues'
        },
        subtitle: {
          text: 'Asterisk'
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          title: {
            text: 'Calls'
          }
        },
        series: [{name: queue, data: chartPoints}]
      });
      setInterval(function(){
        console.log(chart.series[0].points.length);
        if(chart.series[0].points.length < 20){
          chart.series[0].addPoint([new Date(), chart.series[0].points[chart.series[0].points.length-1].y  ]);
        }else{
          chart.series[0].addPoint([new Date(), chart.series[0].points[chart.series[0].points.length-1].y  ], true, true);
        }
      }, 1000);
    }

  });

  self._conn.on('latest', function(queue, points){
    chart.series[0].addPoint([new Date(), points.object.currentCalls/1]);
  });
};

function Table(){
  //this._conn = io.connect('http://localhost:8080/queues');
};

Graph.prototype.foo = function(){

};





        // // queuesIO.on('callsInQueueAppend', function(queue, calls){
        // //   //console.log(chart);
        // //   chart.series.forEach(function(set){
        // //     if(set.name == 1211){
        // //       console.log('adding a point', set.name, calls);
        // //       set.addPoint(calls / 1, false, false);
        // //     }
        // //   })
        // //   chart.redraw();
        // // });
        // var queues = {};