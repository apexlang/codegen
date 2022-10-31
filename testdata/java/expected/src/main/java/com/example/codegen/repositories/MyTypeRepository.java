package com.example.codegen.repositories;

import org.springframework.data.repository.CrudRepository;
import com.example.codegen.models.MyType;

public interface Repository extends CrudRepository<MyType, Long> {

	 public MyType getData(){
		return null;
	 }

}