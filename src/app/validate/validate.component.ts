import {Component, ViewEncapsulation,OnInit,ElementRef, ViewChild, Input} from '@angular/core';
import { InputComponent } from '../input/input.component';
import {FormControl} from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition,MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.css']
})
export class ValidateComponent implements OnInit{

  duration: any;
  number: string = "";
  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "top";
  close:any;
  formfile: any;
  otp: any;
  text1: any = '';
  text2: any = '';
  text3: any = '';
  text4: any = '';
  text5: any = '';


  

  ngOnInit(): void{
    this.duration = 4*1000;
    this.otp = "";  //93391
    this.activatedRoute.paramMap.subscribe(params => {
    this.number = params.get('number') ?? '';
    });
  }
  constructor(
    private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    
  ) {}
  openSnackBar(mgs: string, close: string, duration: any)
  {
    this._snackBar.open(mgs,close,{
      horizontalPosition: "center",
      verticalPosition: "top",
      duration: duration,
      panelClass:['input-snack']   //for background color change see in global styles.css
    });
  }
  verify(): void{

    if(this.Validate())
      {
        this.duration = 3*1000;
        this.formfile = new FormData();
        this.formfile.append('number', this.number); //intha 'number' variable name tha nee back end la request.form[ithukku ulla kudukanum 'number'],
        this.formfile.append('otp', this.otp);    //same as above
        let url = "http://localhost:5000/api/check-user"
        this.http.post<ApiResponse>(url, this.formfile).subscribe(res => {
          // console.log(res);
          if (res.status.statusCode === '200' && res.data === true) {
            console.log('User exists in the database.');
            this.openSnackBar("OTP Entered Successfully","X", this.duration);
            this.router.navigateByUrl('/result');
            return true 
          } else {
            this.openSnackBar("Invalid OTP","X",this.duration);
            return false
          }
        });
      }
  }

  Validate():boolean
  {
    this.otp = this.text1+this.text2+this.text3+this.text4+this.text5;
    //console.log(this.otp); //for seeing in web console
    const symbol = /^[0-9]+$/.test(this.otp);
    if(symbol)
    {
      return true;
    }
    return false;
  }

  move(event:any,previous:any,current:any,next:any)
  {
    var length = current.value.length;
    var maxlength = current.getAttribute('maxlength');
    if(length == maxlength)
    {
      if(next!="")
      {
        next.focus();
      }
    }
    if(event.key === 'Backspace')
    {
      if(previous!="")
      {
        previous.focus();
      }
    }
   // console.log(event);
  }
}

interface ApiResponse {
  status: {
    statusCode: string;
    statusMessage: string;
  };
  data: boolean;
}
