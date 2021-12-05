package com.example.pos.repository.customRepository;

import org.springframework.stereotype.Component;

@Component("configRepositoryCustom")
public class ConfigRepositoryCustomImpl implements ConfigRepositoryCustom {
    private static String collectionName = "config";
    @Override
    public String getCollectionName() {
        return collectionName;
    }
    @Override
    public void setCollectionName(String collectionName) {
        this.collectionName = collectionName;
    }
}
