package com.concretepage.endpoints;

import com.concretepage.entity.Wishlist;
import com.concretepage.gs_ws.*;
import com.concretepage.service.IWishlistService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.util.ArrayList;
import java.util.List;

@Endpoint
public class WishlistEndpoint {
    private static final String NAMESPACE_URI = "http://schemas.xmlsoap.org/soap/envelope/";

    @Autowired
    private IWishlistService wishlistService;

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getWishlistByIdRequest")
    @ResponsePayload
    public GetWishlistByIdResponse getWishlist(@RequestPayload GetWishlistByIdRequest request) {
        GetWishlistByIdResponse response = new GetWishlistByIdResponse();
        WishlistInfo wishlistInfo = new WishlistInfo();
        BeanUtils.copyProperties(wishlistService.getWishlistByClientId(request.getWishlistId()), wishlistInfo);
        response.setWishlistInfo(wishlistInfo);
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getAllWishlistsRequest")
    @ResponsePayload
    public GetAllWishlistsResponse getAllWishlists() {
        GetAllWishlistsResponse response = new GetAllWishlistsResponse();
        List<WishlistInfo> wishlistInfoList = new ArrayList<>();
        List<Wishlist> wishlistList = wishlistService.getAllWishlist();
        for (int i = 0; i < wishlistList.size(); i++) {
            WishlistInfo ob = new WishlistInfo();
            BeanUtils.copyProperties(wishlistList.get(i), ob);
            wishlistInfoList.add(ob);
        }
        response.getWishlistInfo().addAll(wishlistInfoList);
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "addWishlistRequest")
    @ResponsePayload
    public AddWishlistResponse addWishlist(@RequestPayload AddWishlistRequest request) {
        AddWishlistResponse response = new AddWishlistResponse();
        ServiceStatus serviceStatus = new ServiceStatus();
        Wishlist wishlist = new Wishlist();
        wishlist.setBookISBN(request.getBookISBN());
        wishlist.setClientId(request.getClientId());
        wishlist.setPrice(request.getPrice());
        wishlist.setTitlu(request.getTitlu());
        boolean flag = wishlistService.addWishlist(wishlist);
        if (flag == false) {
            serviceStatus.setStatusCode("CONFLICT");
            serviceStatus.setMessage("Content Already Available");
            response.setServiceStatus(serviceStatus);
        } else {
            WishlistInfo wishlistInfo = new WishlistInfo();
            BeanUtils.copyProperties(wishlist, wishlistInfo);
            response.setWishlistInfo(wishlistInfo);
            serviceStatus.setStatusCode("SUCCESS");
            serviceStatus.setMessage("Content Added Successfully");
            response.setServiceStatus(serviceStatus);
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "updateWishlistRequest")
    @ResponsePayload
    public UpdateWishlistResponse updateWishlist(@RequestPayload UpdateWishlistRequest request) {
        Wishlist wishlist = new Wishlist();
        BeanUtils.copyProperties(request.getWishlistInfo(), wishlist);
        wishlistService.updateWishlist(wishlist);
        ServiceStatus serviceStatus = new ServiceStatus();
        serviceStatus.setStatusCode("SUCCESS");
        serviceStatus.setMessage("Content Updated Successfully");
        UpdateWishlistResponse response = new UpdateWishlistResponse();
        response.setServiceStatus(serviceStatus);
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "deleteWishlistRequest")
    @ResponsePayload
    public DeleteWishlistResponse deleteWishlist(@RequestPayload DeleteWishlistRequest request) {
        Wishlist wishlist = wishlistService.getWishlistByWishlistId(request.getWishlistId());
        ServiceStatus serviceStatus = new ServiceStatus();
        if (wishlist == null ) {
            serviceStatus.setStatusCode("FAIL");
            serviceStatus.setMessage("Content Not Available");
        } else {
            wishlistService.deleteWishlist(wishlist);
            serviceStatus.setStatusCode("SUCCESS");
            serviceStatus.setMessage("Content Deleted Successfully");
        }
        DeleteWishlistResponse response = new DeleteWishlistResponse();
        response.setServiceStatus(serviceStatus);
        return response;
    }
}

