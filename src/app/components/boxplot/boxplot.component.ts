import {Component, Input, OnInit} from '@angular/core';
import {DataFrame, IDataFrame} from "data-forge";
import {PlotlyService} from "angular-plotly.js";

@Component({
  selector: 'app-boxplot',
  templateUrl: './boxplot.component.html',
  styleUrls: ['./boxplot.component.css']
})
export class BoxplotComponent implements OnInit {
  graphData: any[] = []
  value = {min: 0, max:0}
  minValue = 0
  minColor = "#602F72"
  minMidColor = "#B14D75"
  midColor = "#EEA96E"
  maxValue = 0
  midMaxColor = "#EDC0B4"
  maxColor = "#F9EFEF"
  graphLayout: any = {title:"BoxPlot", width: 1000, height: 1000,
    xaxis:{"tickangle": 90}}

  _data: IDataFrame = new DataFrame();
  @Input() set data(value:IDataFrame) {
    this._data = value
    console.log(value)
    this.graphBoxPlot()
  }
  get data(): IDataFrame {
    return this._data
  }
  constructor(private plotly: PlotlyService) { }

  async downloadPlotlyExtra(format: string) {
    const graph = this.plotly.getInstanceByDivId("boxplot");
    const p = await this.plotly.getPlotly();
    await p.downloadImage(graph, {format: format, width: 1000, height: 1000, filename: "image"})

  }

  ngOnInit(): void {
  }

  graphBoxPlot(group: any = {}) {
    const temp: any = {}
    this.graphData = []
    if (Object.keys(group).length === 0) {
      for (const r of this._data) {
        if (!(r.Samples in temp)) {
          temp[r.Samples] = {
            y: [], type: 'box', name: r.Samples, boxpoints: 'Outliers'
          }
        }
        temp[r.Samples].y.push(r.Values)
      }
    } else {
      for (const r of this._data) {
        if (!(r.Samples in temp)) {
          temp[group[r.Samples]] = {
            y: [], type: 'box', name: group[r.Samples], boxpoints: 'Outliers'
          }
        }
        temp[r.Samples].y.push(r.Values)
      }
    }
    for (const t in temp) {
      this.graphData.push(temp[t])
    }
  }
}
