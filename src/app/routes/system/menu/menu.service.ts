import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
// TODO: 这个报文头是否需要设置？？
const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class SysMenuService {


    constructor(private http: HttpClient) {
    }

    // 查询菜单信息列表(分页)
    qryMenuByPage(params): Observable<any> {
        return this.http.post('system/menuManage/qryByPage', params);
    }

    // 查询所有菜单
    qryAllMenu(params): Observable<any> {
        return this.http.post('system/menuManage/qryAllMenu', params);
    }


    // 查询所有菜单
    updataMenu(params): Observable<any> {
        return this.http.post('system/menuManage/menuInfo', params);
    }

    // 查询自定义参数信息列表
    qrySelfDefinedParamInfo(params): Observable<any> {
        return this.http.get('http://localhost:4203/assets/app-data.json');
        // return this.http.post('visible/dashBoardManage/qrySelfDefinedParamInfo', params);
    }

    // 保存自定义参数信息列表
    saveSelfDefinedParamInfo(params): Observable<any> {
        return this.http.post('visible/dashBoardManage/saveSelfDefinedParamInfo', params);
    }

    // 保存系统级别参数信息列表

    saveSystemParamConfig(params): Observable<any> {
        return this.http.post('visible/dashBoardManage/saveSystemParamConfig', params);
    }

}
