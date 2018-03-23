import { Injectable } from '@angular/core';
import { ThemeType } from '../themes/themes.service';

const KEY = 'layout';

export interface User {
    name?: string;
    avatar?: string;
    email?: string;
    [key: string]: any;
}

export interface App {
    title:string;
    appId:string;
    name?: string;
    description?: string;
    year?: number;
    [key: string]: any;
}

export type SidebarThemeType = 'light' | 'dark';

export interface Layout {
    /** 是否固定顶部菜单 */
    fixed: boolean;
    /** 是否折叠右边菜单 */
    collapsed: boolean;
    /** 是否固定宽度 */
    boxed: boolean;
    /** 当前主题 */
    theme: ThemeType;
    /** 语言环境 */
    lang: string;
}

@Injectable()
export class SettingsService {
    app: App = {
        title:'',
        appId:'',
        year: (new Date()).getFullYear()
    };

    user: User = {};

    private _layout: Layout = null;

    private get(key: string) {
        return JSON.parse(localStorage.getItem(key) || 'null') || null;
    }

    private set(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    get layout(): Layout {
        if (!this._layout) {
            this._layout = Object['assign'](<Layout>{
                fixed: true,
                collapsed: false,
                boxed: false,
                theme: 'A',
                lang: null
            }, this.get(KEY));
            this.set(KEY, this._layout);
        }
        return this._layout;
    }

    setLayout(name: string, value: any): boolean {
        if (typeof this.layout[name] !== 'undefined') {
            this.layout[name] = value;
            this.set(KEY, this._layout);
            return true;
        }
        return false;
    }

    setApp(val: App) {
        if(val == null){
            this.app = {
                title:'',
                appId:'',
                year: (new Date()).getFullYear()
            };
        }else{
            this.app = Object['assign'](this.app, val);
        }
    }

    setUser(val: User) {
        if(val == null){
            this.user = {};
        }else{
            this.user = Object['assign'](this.user, val);
        }
    }

}
