import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DataFrame, fromCSV, IDataFrame} from "data-forge";
import {WebService} from "../../service/web.service";

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {
  fileName: string = "";
  file: File|undefined;
  df: IDataFrame|undefined;
  @Output() dataframe = new EventEmitter<IDataFrame>();
  wideForm: boolean = true
  constructor(private http: WebService) {

  }

  handleFile(e: Event) {
    if (e.target) {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        this.file = target.files[0];
        this.fileName = target.files[0].name;
        const reader = new FileReader();

        reader.onload = (event) => {
          const loadedFile = reader.result;
          this.df = fromCSV(<string>loadedFile);

          if (this.wideForm) {
            const temp: any[] = []
            const columns = this.df.getColumnNames()
            for (const c of columns.slice(1)) {
              const values = this.df.getSeries(c).bake().toArray()
              for (let i = 0; i<values.length; i++) {
                temp.push({Samples: c, Values: values[i], Groups: c})
              }
            }
            this.dataframe.emit(new DataFrame(temp))
          } else {
            const columns = this.df.getColumnNames()
            const sample = columns[0]
            const value = columns[1]
            const renameOb: any = {sample: "Samples", value: "Values"}
            if (columns.length > 2) {
              const group = columns[2]
              renameOb[group] = "Groups"
            }
            this.df = this.df.renameSeries(renameOb)
            this.dataframe.emit(this.df);
          }

        };
        reader.readAsText(this.file);
      }
    }
  }

  loadTest() {
    this.http.getWideInput().subscribe(data => {
      this.df = fromCSV(<string>data.body)
      const temp: any[] = []
      const columns = this.df.getColumnNames()
      for (const c of columns.slice(1)) {
        const values = this.df.getSeries(c).bake().toArray()
        for (let i = 0; i<values.length; i++) {
          temp.push({Samples: c, Values: values[i], Groups: c})
        }
      }
      this.dataframe.emit(new DataFrame(temp))
    })
  }

  ngOnInit(): void {
  }

}
