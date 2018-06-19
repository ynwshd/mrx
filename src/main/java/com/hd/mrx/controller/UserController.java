/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.hd.mrx.controller;

import com.hd.mrx.model.User;
import com.hd.mrx.model.page.Jpage;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import com.hd.mrx.service.UserService;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

/**
 *
 * @author ynwshd
 */
@Controller
@RequestMapping("/User")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserService userService;

    /**
     *
     * @return
     */
    @RequestMapping("/Show/")
    public String Show() {
        User user = userService.getUser();
        System.out.println(user.toString());
        return "user/show";
    }

    @RequestMapping(value = "/GetPage/", method = RequestMethod.POST)
    public ResponseEntity<Jpage<User>> GetUserPage(@PathVariable String findkey,
            @PathVariable Integer page,
            @PathVariable Integer pageSize
    ) {
        List<User> list = new ArrayList<>();
        list.add(new User("1", "黄达", 35));
        list.add(new User("2", "张三", 88));
        Jpage<User> jpage = new Jpage<>(1, 10, 100, list);
        return new ResponseEntity<>(jpage, HttpStatus.OK);
    }

    @RequestMapping(value = "/doUpload", method = RequestMethod.POST)
    public String doUploadFile(@RequestParam("file") MultipartFile file) throws IOException {

        if (!file.isEmpty()) {
            log.debug("Process file: {}", file.getOriginalFilename());
            FileUtils.copyInputStreamToFile(file.getInputStream(), new File("c:\\temp\\imooc\\", System.currentTimeMillis() + file.getOriginalFilename()));
        }

        return "success";
    }

    @RequestMapping(value = "/doUpload2", method = RequestMethod.POST)
    public String doUploadFile2(MultipartHttpServletRequest multiRequest) throws IOException {

        Iterator<String> filesNames = multiRequest.getFileNames();
        while (filesNames.hasNext()) {
            String fileName = filesNames.next();
            MultipartFile file = multiRequest.getFile(fileName);
            if (!file.isEmpty()) {
                log.debug("Process file: {}", file.getOriginalFilename());
                FileUtils.copyInputStreamToFile(file.getInputStream(), new File("c:\\temp\\imooc\\", System.currentTimeMillis() + file.getOriginalFilename()));
            }

        }

        return "success";
    }

}
