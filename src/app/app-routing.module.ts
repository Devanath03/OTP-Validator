import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputComponent } from './input/input.component';
import { ValidateComponent } from './validate/validate.component';
import { ResultComponent } from './result/result.component';
const routes: Routes = [
  {
    path:'',component:InputComponent
  },
  {
    path:'validate/:number',component:ValidateComponent //FOR PASSING NUMBER VALUE IN THE URL
  },
  {
    path:'result',component:ResultComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
