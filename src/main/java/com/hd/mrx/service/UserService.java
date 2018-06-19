/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.hd.mrx.service;

import com.hd.mrx.model.User;
import org.springframework.stereotype.Service;

/**
 *
 * @author ynwshd
 */
@Service
public interface UserService {

    User getUser();
}
