package com.example.codegen.repositories;

import org.springframework.data.repository.CrudRepository;
import com.example.codegen.models.MyType;


public interface MyTypeRepository extends CrudRepository<MyType, Integer>  {
	 public MyType getData(){
		return null;
	 }
}