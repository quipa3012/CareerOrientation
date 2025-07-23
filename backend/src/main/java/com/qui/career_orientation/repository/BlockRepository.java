package com.qui.career_orientation.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.qui.career_orientation.entity.Block;

@Repository
public interface BlockRepository extends JpaRepository<Block, Long> {
    Optional<Block> findByCode(String code);

    Optional<Block> findByModelLabel(Integer modelLabel);

    boolean existsByCode(String code);
}
