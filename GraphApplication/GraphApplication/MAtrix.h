//
//  MAtrix.h
//  GraphApplication
//
//  Created by Albert Ceballos on 13/2/24.
//

#ifndef MAtrix_h
#define MAtrix_h


#endif /* MAtrix_h */

#pragma once
#include <assert.h>
#include <iostream>
using namespace std;


template <class Element>
class Matrix {
private:
    size_t m_Columns;
    size_t m_Rows;
    Element* m_pElements;
public:
    Matrix() : m_Columns(0), m_Rows(0), m_pElements(nullptr) {}
    Matrix(size_t rows, size_t columns) {
        assert(rows > 0);
        assert(columns > 0);
        m_Columns = columns;
        m_Rows = rows;
        m_pElements = new Element[m_Columns * m_Rows];
    }
    Matrix(const Matrix& obj) : m_Columns(obj.m_Columns), m_Rows(obj.m_Rows) {
        m_pElements = new Element[m_Rows * m_Columns];
        for (int i = 0; i < m_Rows; ++i) {
            for (int j = 0; j < m_Columns; ++j) {
                (*this)(i, j) = obj(i, j);
            }
        }
    }
    Matrix& operator=(const Matrix& obj) {
        assert(m_Rows == obj.m_Rows);
        assert(m_Columns == obj.m_Columns);
        for (int i = 0; i < m_Rows; ++i) {
            for (int j = 0; j < m_Columns; ++j) {
                (*this)(i, j) = obj(i, j);
            }
        }
    }
    ~Matrix() {
        if (m_pElements) delete[] m_pElements;
    }
    void Clean() {
        if (m_pElements) delete[] m_pElements;
        m_Rows = 0;
        m_Columns = 0;
    }
    void Resize(size_t rows, size_t columns) {
        assert(rows > 0);
        assert(columns > 0);
        Clean();
        m_Columns = columns;
        m_Rows = rows;
        m_pElements = new Element[rows * columns];
    }
    Element& operator()(int i, int j) const {
        assert(i >= 0);
        assert(i < m_Rows);
        assert(j >= 0);
        assert(j < m_Columns);
        return m_pElements[i * m_Columns + j];
    }
    size_t GetRows() const { return m_Rows;  }
    size_t GetColumns() const { return m_Columns; }
};

template<class Element>
ostream& operator<<(ostream& out, const Matrix<Element> &m) {
    for (int i = 0; i < m.GetRows(); ++i) {
        out << endl;
        for (int j = 0; j < m.GetColumns(); ++j) {
            if (j > 0) out << ' ';
            out << m(i, j);
        }
    }
    return out;
}
