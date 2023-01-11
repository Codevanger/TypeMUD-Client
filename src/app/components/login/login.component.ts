/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private confirmService: ConfirmationService
  ) {}

  @Input()
  public displayLogin = false;

  public loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(21),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(48),
    ]),
    rememberMe: new FormControl(false),
  });

  public ngOnInit(): void {
    const fs = window.require('fs');

    fs.readFile('./login', { encoding: 'utf8' }, (err, data) => {
      if (err) {
        return;
      }

      if (data) {
        const loginData = JSON.parse(data);

        this.loginForm.get('username').setValue(loginData.username);
        this.loginForm.get('password').setValue(loginData.password);
      }
    });

    this.loginForm
      .get('rememberMe')
      .valueChanges.pipe(filter((value) => value))
      .subscribe(() => {
        this.confirmService.confirm({
          message:
            'Вы ДЕЙСТВИТЕЛЬНО хотите сохранить ваш логин и пароль локально, на вашем компьютере? Это может быть небезопасно!',
          acceptLabel: 'Да, я понимаю риски',
          rejectLabel: 'Нет, я передумал',
          reject: () => {
            this.loginForm.get('rememberMe').setValue(false);
          },
        });
      });
  }

  public login(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.authService
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe((result) => {
        if (!result) {
          return;
        }

        if (!this.loginForm.value.rememberMe) {
          return;
        }

        const fs = window.require('fs');

        fs.writeFile(
          './login',
          JSON.stringify({
            username: this.loginForm.value.username,
            password: this.loginForm.value.password,
          }),
          { encoding: 'utf8' },
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
      });
  }
}
