/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.hd.mrx.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author ynwshd
 * 这是首页
 */
@Controller
@RequestMapping("/")
public class IndexController {
    private static final Logger log = LoggerFactory.getLogger(IndexController.class);
    /**
     *
     * @return
     */
    @RequestMapping("/")
    public String indexView() {
     
        return "index";
    }
}
