import { NgModule } from '@angular/core'
import { AdminComponent } from './admin'
import { AdminRoutingModule } from './routing'
import { CommonModule } from '@angular/common'

@NgModule({
    declarations: [AdminComponent],
    imports: [
        CommonModule,
        AdminRoutingModule
    ]
})
export class AdminModule { }