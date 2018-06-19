/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.hd.mrx.model.page;

import java.text.DecimalFormat;
import java.util.List;

/**
 * 适应jgrid的分页
 *
 * @author ynwshd
 * @param <T>
 */
public class Jpage<T> {

    public Jpage(Integer page, Integer pageSize, Integer records, List<T> rows) {
        this.page = page;
        this.pageSize = pageSize;
        this.records = records;
        this.rows = rows;
    }

    public Jpage() {
    }

    /**
     * 总页数
     */
    private Integer total;

    /**
     * 当前页
     */
    private Integer pageSize;

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
    /**
     * 当前页
     */
    private Integer page;
    /**
     * 查询出的记录数
     */
    private Integer records;
    /**
     * 包含实际数据的数组
     */
    private List<T> rows;

    public Integer getTotal() {
        double num = (double) (records / pageSize);//返回的是String类型    
        total = (int) Math.ceil(num);
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getRecords() {
        return records;
    }

    public void setRecords(Integer records) {
        this.records = records;
    }

    public List<T> getRows() {
        return rows;
    }

    public void setRows(List<T> rows) {
        this.rows = rows;
    }

}
