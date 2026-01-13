import { Component, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { CustomersService } from '@core/services/customers.service'
import { TranslateModule } from '@ngx-translate/core'
import { CustomerPayload } from '../../../../core/models/customer.model'
import Swal from 'sweetalert2'
import { Router } from '@angular/router'
interface FileMap {
  [key: string]: File
}

@Component({
  selector: 'customer-info',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, TranslateModule ],
  templateUrl: './customer-info.component.html',
  styles: [``],
})
export class CustomerInfoComponent implements OnInit {
  customerForm: FormGroup
  debugPayload!: CustomerPayload
  missingFields: string[] = []
  selectedFiles: FileMap = {}

  private readonly requiredFields = [
    'name',
    'nationalId',
    'country',
    'password',
    'phone',
    'email',
    'nationalIdImageUrl',
    'ibanImageUrl',
  ]

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    private router: Router
  ) {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      nameEN: ['', [Validators.minLength(2)]],
      nationalId: ['', [Validators.required, Validators.minLength(10)]],
      country: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\+?[0-9]{9,15}$/)],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
        ],
      ],
      nafathSub: [''],
      iban: ['', [Validators.required, Validators.pattern(/^[0-9]{15,34}$/)]],
      nationalIdImageUrl: ['', Validators.required],
      ibanImageUrl: ['', Validators.required],
      profileImage: [''],
      status: ['confirmed', Validators.required],
      role: ['user', Validators.required],
    })
  }

  ngOnInit(): void {
    this.customerForm.get('country')?.valueChanges.subscribe((value: string) => {
      const v = (value || '').toLowerCase()
      const passwordControl = this.customerForm.get('password')
      const nafathControl = this.customerForm.get('nafathSub')

      if (v === 'sa' || v === 'saudi arabia') {
        nafathControl?.setValidators([Validators.required])
        passwordControl?.clearValidators()
        passwordControl?.setValue('')
      } else {
        passwordControl?.setValidators([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
        ])
        nafathControl?.clearValidators()
        nafathControl?.setValue('')
      }

      passwordControl?.updateValueAndValidity({ emitEvent: false })
      nafathControl?.updateValueAndValidity({ emitEvent: false })
    })
  }

  onFileSelected(event: Event, field: keyof FileMap): void {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      Swal.fire(' خطأ', 'يُسمح فقط بصور JPG أو PNG', 'warning')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire(' حجم الملف كبير', 'الحد الأقصى هو 2 ميجابايت', 'warning')
      return
    }

    this.selectedFiles[field] = file
    this.customerForm.patchValue({ [field]: file.name })
    this.customerForm.get(field as string)?.updateValueAndValidity()
  }

  private buildPayload(): CustomerPayload {
  const fv = this.customerForm.value;
  const country = fv.country?.trim().toLowerCase();

  const payload: CustomerPayload = {
    name: fv.name?.trim(),
    nameEN: fv.nameEN?.trim(),
    nationalId: fv.nationalId?.trim(),
    country: fv.country?.trim(),
    email: fv.email?.trim(),
    phone: fv.phone?.trim(),
    iban: fv.iban?.trim(),
    nationalIdImageUrl: fv.nationalIdImageUrl?.trim(),
    ibanImageUrl: fv.ibanImageUrl?.trim(),
    profileImage: fv.profileImage?.trim(),
    status: fv.status || 'pending', 
    role: fv.role || 'user',
     customerStatus: fv.status, 
  };

  if (country !== 'sa' && country !== 'saudi arabia') {
    payload.password = fv.password;
  } else {
    payload.nafathSub = fv.nafathSub;
  }

  return payload;
}


  private computeMissingFields(payload: CustomerPayload): string[] {
    const isSaudi = ['sa', 'saudi arabia'].includes(
      payload.country.toLowerCase()
    )
    return this.requiredFields.filter((f) => {
      if (f === 'password' && isSaudi) return false
      const val = (payload as any)[f]
      return val === undefined || val === null || String(val).trim() === ''
    })
  }

  private refreshDebug(): void {
    this.debugPayload = this.buildPayload()
    this.missingFields = this.computeMissingFields(this.debugPayload)
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched()
      Swal.fire(' تحقق من البيانات', 'يرجى تصحيح الأخطاء قبل الإرسال', 'warning')
      return
    }

    const payload = this.buildPayload()

    this.customersService
      .addCustomer(payload, {
        nationalIdImageUrl: this.selectedFiles['nationalIdImageUrl'],
        ibanImageUrl: this.selectedFiles['ibanImageUrl'],
        profileImage: this.selectedFiles['profileImage'],
      })
      .subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'تم بنجاح ',
            text: 'تم إنشاء العميل بنجاح!',
            confirmButtonText: 'حسناً',
          })
          this.customerForm.reset()
          this.selectedFiles = {}
          this.router.navigate(['/customers/list'])
        },
        error: (err) => {
          console.error('Backend error:', err)
          Swal.fire({
            icon: 'error',
            title: 'حدث خطأ ',
            text:
              err?.error?.message ||
              'حدث خطأ أثناء إنشاء العميل، يرجى المحاولة لاحقاً.',
          })
        },
      })
  }
}
