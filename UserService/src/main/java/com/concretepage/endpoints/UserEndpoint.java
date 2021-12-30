package com.concretepage.endpoints;

import com.concretepage.gs_ws.*;
import com.concretepage.service.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.util.ArrayList;
import java.util.List;

@Endpoint
public class UserEndpoint {
    private static final String NAMESPACE_URI = "http://schemas.xmlsoap.org/soap/envelope/";

    @Autowired
    UserService userService;

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "login")
    @ResponsePayload
    public GetWishlistByIdResponse getWishlist(@RequestPayload GetWishlistByIdRequest request) {
        GetWishlistByIdResponse response = new GetWishlistByIdResponse();
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "validateToken")
    @ResponsePayload
    public GetAllWishlistsResponse getAllWishlists() {
        GetAllWishlistsResponse response = new GetAllWishlistsResponse();
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "destroyToken")
    @ResponsePayload
    public AddWishlistResponse addWishlist(@RequestPayload AddWishlistRequest request) {
        AddWishlistResponse response = new AddWishlistResponse();
        return response;
    }

}
