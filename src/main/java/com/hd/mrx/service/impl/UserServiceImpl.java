/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.hd.mrx.service.impl;

import com.hd.mrx.model.User;
import org.springframework.stereotype.Service;
import com.hd.mrx.service.UserService;

/**
 *
 * @author ynwshd
 */
@Service("userService")
public class UserServiceImpl implements UserService {

    @Override
    public User getUser() {
        User user = new User("1", "黄达", 35);
        return user;
    }
}
