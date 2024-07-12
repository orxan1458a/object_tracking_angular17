import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DataService } from 'src/app/core/services/db/data-service.service';
import { VehicleService } from 'src/app/core/services/subject/vehicle_filter.service';
import * as echarts from 'echarts';
import { DatePipe } from '@angular/common';
type EChartsOption = echarts.EChartsOption;

@Component({
  selector: 'app-trajectory-info-container',
  templateUrl: './trajectory-info-container.component.html',
  styleUrls: ['./trajectory-info-container.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class TrajectoryInfoContainerComponent implements OnInit, OnDestroy {
  isPlay: boolean = false;
  millis: number = 1000;
  x: number = 1;
  isReset = false;
  isDestroy = false;
  i: number = 0;
  speedList: number[] = [];

  constructor(
    public data_service: DataService,
    private vehicle_service: VehicleService,
    private datePipe: DatePipe
  ) { }
  ngOnDestroy(): void {
    this.data_service.animation_object = [0, 0];
    this.isDestroy = true;
  }

  ngOnInit(): void {
  }

  fillGraphic(chartType:string) {
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);

    const data: any[] = []

    this.data_service.carTrackData.map((car) => data.push([+new Date(`1970-01-01T${car[2]}`), 
    (chartType=='speed'?car[3]:car[4])]));

    //EChartsOption
    const option = {
      tooltip: {
        trigger: 'axis',
        position: function (pt: any) {
          return [pt[0], '10%'];
        },
        formatter: (value: any) => {
          const data = value[0].data;
          const chartName=chartType=='speed'?'Sürət':'Batareya'
          return `Vaxt : ${this.datePipe.transform(data[0], 'HH:mm:ss')} , ${chartName} : ${data[1]}`;
        }
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLabel: {
          formatter: (value: any) => this.datePipe.transform(value, 'HH:mm:ss')
        }
      },
      yAxis: {
        boundaryGap: [0, '1%'],
        type: 'value',
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        // {
        //   start: 0,
        //   end: 20,
        //   labelFormatter: (value: any) => {
        //     return this.datePipe.transform(value, 'HH:mm:ss')
        //   }
        // },
      ],
      series: [
        {
          data: data,
          smooth: false,
          symbol: 'none',
          areaStyle: {},
          type: 'line',
        }
      ]
    };

    option && myChart.setOption(option);
  }

  

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async animation(index: number) {
    for (this.i = index; this.i < this.data_service.carTrackData.length; this.i++) {
      if (this.data_service.last_trajectory_point.gps_id == 0 || this.isDestroy) {
        this.data_service.animation_object = [0, 0]
        break
      }
      if (this.isReset) {
        break;
      }

      if (!this.isPlay) {
        break;
      }

      if (this.i + 1 == this.data_service.carTrackData.length) {
        this.i = 0;
      }

      this.data_service.animation_object = [this.data_service.carTrackData[this.i][0], this.data_service.carTrackData[this.i][1]]
      this.vehicle_service.vehicle_set_center_by_latlon.next([this.data_service.carTrackData[this.i][0], this.data_service.carTrackData[this.i][1]])
      await this.delay(this.millis / this.x);

    }
  }
  clickPlay() {
    this.isReset = false;
    this.isPlay = !this.isPlay;
    if (this.isPlay) {
      this.animation(this.i);
    }
    else {

    }
  }

  clickReset() {
    this.isPlay = false;
    this.isReset = true;
    this.i = 0;
    this.data_service.animation_object = [this.data_service.carTrackData[0][0], this.data_service.carTrackData[0][1]]
  }


  updateSetting(event: any) {
    this.i = event.value;
    this.data_service.animation_object = [this.data_service.carTrackData[this.i][0], this.data_service.carTrackData[this.i][1]];
    this.vehicle_service.vehicle_set_center_by_latlon.next([this.data_service.carTrackData[this.i][0], this.data_service.carTrackData[this.i][1]])

    console.log(this.i)
  }

  tabChange($event: any) {
    if($event.index==1){
      this.fillGraphic('speed');
      console.log($event)
    }
    if($event.index==2){
      this.fillGraphic('battery');
      console.log($event)
    }
  }
}
