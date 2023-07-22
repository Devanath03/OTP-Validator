import {Component, ViewEncapsulation,OnInit,ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition,MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit{
  
  duration: any;
  number = "";  //number: string;
  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "top";
  close:any;
  formfile: any;
  static number: any;

  ngOnInit(): void{
    this.duration = 4*1000;
  }
  constructor(
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private router: Router,
  ) {
    //NUMBER CAN BE INITIALIZED AS BELOW
    //this.number = "";
   }
  openSnackBar(mgs: string, close: string, duration: any)
  {
    this._snackBar.open(mgs,close,{
      horizontalPosition: "center",
      verticalPosition: "top",
      duration: duration,
      panelClass:['input-snack']   //for background color change see in global styles.css
    });
  }
  send(): void
  {
    if(this.validate())
    {
      this.formfile = new FormData();
      this.formfile.append('number', this.number);
      let url = "http://localhost:5000/api/send"
      this.http.post(url, this.formfile).subscribe((res) => {
      },
        (error) => {
          this.openSnackBar(error.message, "X",this.duration);
        });
      this.openSnackBar("Entered Successfully","X",this.duration);
      this.router.navigate(['/validate',this.number]);
    }
    else{
       this.openSnackBar("Invalid Mobile Number","X",this.duration);
    }
  }

  validate(): boolean {

    const mobileNumberPattern = /^[1-9]\d{9}$/; // Regular expression pattern for a 10-digit mobile number starting from 1-9

    if (this.number.match(mobileNumberPattern)) {
      
      console.log('Mobile number is valid');

      return true;
    } 
    else {

      console.log('Invalid mobile number');

      return false;
    }
  }

  static Value(): any {
    return this.number;
  }

}
