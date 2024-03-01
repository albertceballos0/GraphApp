//
//  Graph.h
//  GraphApplication
//
//  Created by Albert Ceballos on 13/2/24.
//

#ifndef Graph_h
#define Graph_h


#endif /* Graph_h */

// AssertsMaximFluxe.cpp : Este archivo contiene la función "main". La ejecución del programa comienza y termina ahí.
//

#pragma once

#include <stdlib.h>
#include <stdarg.h>
#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <list>
#include <math.h>
#include <set>
#include <algorithm>
#include <limits>
#include <cfloat>

using namespace std;
#undef max
#undef min

// =============================================================================
// UTILITATS ===================================================================
// =============================================================================

/*
template<class T> T max(T a, T b)
{
    if (a > b) return a;
    else return b;
}

template<class T> T min(T a, T b)
{
    if (a < b) return a;
    else return b;
}
*/

string StrPrint(const char* Format, ...);

// =============================================================================
// DEBUG =======================================================================
// =============================================================================

bool MyAssertFun(const char*strcond, const char*FileName, int line, const char*Msg = NULL);
#ifdef NDEBUG
#define MyAssert(cond)
#else
#define MyAssert(cond) ((void) ((cond) || MyAssertFun(#cond, __FILE__, __LINE__)))
#endif


// =============================================================================
// EXCEPCIONS ==================================================================
// =============================================================================

class MyException : public exception {
public:
private:
    // Campos
    char m_Message[256];
public:
    MyException() {}
    MyException(const char *Format, ...);
    MyException(const MyException& rhs);
    virtual const char *what() const throw() { return m_Message; }
};


// =============================================================================
// CGPoint =====================================================================
// =============================================================================

class CGPoint
{

public:
    double m_X, m_Y;

    CGPoint() : m_X(0.0), m_Y(0.0) {}
    CGPoint(const double x, const double y = 0) : m_X(x), m_Y(y) {}
    CGPoint(const CGPoint&p) : m_X(p.m_X), m_Y(p.m_Y) {}
    //CGPoint(const CPoint &p) : m_X(p.x), m_Y(p.y) {}
    //operator CPoint() { return CPoint(int(m_X), int(m_Y)); }
    CGPoint& operator=(const CGPoint &p) {
        m_X = p.m_X;
        m_Y = p.m_Y;
        return *this;
    }
    CGPoint operator+(const CGPoint &p2)  const {
        return CGPoint(m_X + p2.m_X, m_Y + p2.m_Y);
    }
    CGPoint operator+=(const CGPoint &p2) {
        m_X += p2.m_X;
        m_Y += p2.m_Y;
        return *this;
    }
    CGPoint operator-(const CGPoint &p2)  const {
        return CGPoint(m_X - p2.m_X, m_Y - p2.m_Y);
    }
    CGPoint operator-=(const CGPoint &p2) {
        m_X -= p2.m_X;
        m_Y -= p2.m_Y;
        return *this;
    }
    CGPoint operator*(const double n) {
        return CGPoint(m_X*n,m_Y*n);
    }
    CGPoint operator*=(const double n) {
        m_X *= n;
        m_Y *= n;
        return *this;
    }
    CGPoint operator/(const double n) {
        return CGPoint(m_X/n, m_Y/n);
    }
    CGPoint operator/=(const double n) {
        m_X /= n;
        m_Y /= n;
        return *this;
    }
    CGPoint operator-()  const {
        return CGPoint(-m_X, -m_Y);
    }
    double operator*(const CGPoint &p2)  const {
        return m_X * p2.m_X + m_Y * p2.m_Y;
    }
    bool operator==(const CGPoint& p)  const {
        return m_X == p.m_X && m_Y == p.m_Y;
    }
    bool operator!=(const CGPoint& p)  const {
        return m_X != p.m_X || m_Y != p.m_Y;
    }
    double Module() { return sqrt(m_X*m_X + m_Y * m_Y); }
    double Distance(CGPoint &p2) { return sqrt((m_X - p2.m_X)*(m_X - p2.m_X) + (m_Y - p2.m_Y)*(m_Y - p2.m_Y)); }
    double Distance2(CGPoint& p2) { return (m_X - p2.m_X) * (m_X - p2.m_X) + (m_Y - p2.m_Y) * (m_Y - p2.m_Y); }
};

inline CGPoint operator*(double v, const CGPoint& p) {
    return CGPoint(v*p.m_X, v*p.m_Y);
}

inline CGPoint operator*(const CGPoint& p, double v) {
    return CGPoint(v*p.m_X, v*p.m_Y);
}

inline CGPoint operator/(const CGPoint& p, double v) {
    return CGPoint(p.m_X / v, p.m_Y / v);
}

inline ostream& operator<< (ostream& s, const CGPoint& p) {
    s << "(" << p.m_X << ", " << p.m_Y << ")";
    return s;
}

inline CGPoint Min(const CGPoint& p1, const CGPoint& p2) {
    return CGPoint(min(p1.m_X, p2.m_X), min(p1.m_Y, p2.m_Y));
}

inline CGPoint Max(const CGPoint& p1, const CGPoint& p2) {
    return CGPoint(max(p1.m_X, p2.m_X), max(p1.m_Y, p2.m_Y));
}


// =============================================================================
// GRAPH Classes ===============================================================
// =============================================================================
/*
Els grafs son dirigits. Per construir un graf no dirigit hi ha dos arestes que
conecten els vertexs en les dos direccions. Aquetes arestes estan relacionades
amb apuntadors.
*/

class CEdge;
class CGraph;
class CMaxFlow;

// CVertex =====================================================================

class CVertex {
public:
    // Atributs generals de CVertex
    string m_Name; // Nom del vertex
    CGPoint m_Point;
    list<CEdge*> m_Edges;
    // Atributos de Dijkstra
    double m_DijkstraDistance;
    bool m_DijkstraVisit;
    CEdge* m_pDijkstraPrevious;
    // Atributs per Kruskal
    int m_KruskalLabel;
    // Marcar
    bool m_Marca;
    // TrobaCami
    bool m_JaHePassat;

    // Métodes
    CEdge* FindEdge(const char* name);
    bool MemberP(CEdge *pEdge);
    bool NeighbordP(CVertex* pVertex);
    void Unlink(CEdge *pEdge);

    CVertex(const char* name, double x, double y)
        : m_Name(name)
        , m_Point(x, y)
        , m_DijkstraDistance(-1.0)
    {}
};

inline ostream& operator<< (ostream& s, const CVertex& v) {
    s << "VERTEX(" << v.m_Name << "," << v.m_Point << ")";
    return s;
}


// CEdge =======================================================================

class CEdge {
public:
    string m_Name; // Nom del edge
    double m_Length; // Valor que se le asocia al edge: longitud, peso, coste, etc.
    CVertex* m_pOrigin;
    CVertex* m_pDestination;
    CEdge* m_pReverseEdge; // En caso de grafo no dirigido cada arista tiene su inverso.
    bool m_Processed;
    bool m_Used;

public:
    CEdge(const char* name, double length, CVertex* pOrigin, CVertex* pDestination, CEdge* pReverseEdge)
        : m_Name(name)
        , m_Used(false)
        , m_Length(length)
        , m_pOrigin(pOrigin)
        , m_pDestination(pDestination)
        , m_pReverseEdge(pReverseEdge)
    {}


};

inline ostream& operator<< (ostream& s, const CEdge& e) {
    s << "EDGE(" << e.m_Name << "," << e.m_pOrigin->m_Name << "-->" << e.m_pDestination->m_Name << ", " << e.m_Length << ")";
    return s;
}

// CGraph ======================================================================

class CGraph {
public:
    list<CVertex> m_Vertices;
    list<CEdge> m_Edges;
    string m_Filename;

    bool m_Directed; // Directed graph o undirected graph

public:
    CGraph(bool directed);
    ~CGraph();
    void Clear();
    void ClearDistances();

    // Vertices
    CVertex* NewVertex(const char *name, double x, double y);
    CVertex* NewVertex(const CGPoint &point);
    void DeleteVertex(CVertex *pVertex);
    CVertex* FindVertex(const char *name);
    CVertex* FindVertex(const CGPoint &point, double radius);
    CVertex* GetVertex(const char *name);
    CVertex* GetVertex(const int index);
    int GetVertexIndex(const CVertex* pVertex);

    bool MemberP(CVertex *pVertex);
    size_t GetNVertices() { return m_Vertices.size(); }

    // Edges
    CEdge* NewEdge(const char* name, double value, const char* originName, const char* destionatioName);
    CEdge* NewEdge(const char* name, double value, CVertex* pOrigin, CVertex* pDestination);
    CEdge* NewEdge(CVertex *pOrigin, CVertex* pDestination);
    void DeleteEdge(CEdge *pEdge);
    CEdge* FindEdge(CVertex* pVOrigin, CVertex* pVDestination);
    CEdge* FindEdge(const char* name);
    CEdge* FindEdge(const CGPoint &point, double radius);
    bool MemberP(CVertex* pVOrigin, CVertex* pVDestination) { return FindEdge(pVOrigin, pVDestination) != NULL; }
    bool MemberP(CEdge *pEdge);
    size_t GetNEdges() { return m_Edges.size(); }
    void SetDistancesToEdgeLength();



    void RandomCreation(int nVertices, int nEdges);
    void CreateGrid(int nRows, int nColumns);
    bool GreaterLengthDifferenceP(double l, double minLength);
    void ToPlannar();

    void Load(const char* filename);
    void LoadDistances(const char* filename);

    //CMaxFlow ReadMaxFlow(const char* filename);
};

ostream& operator<< (ostream& s, const CGraph& graph);

// =============================================================================
// CVisits =====================================================================
// =============================================================================

class CVisits {
public:
    list<CVertex*> m_Vertices;
    CGraph* m_pGraph;
    //CVisits() {m_pGraph = NULL; }
    CVisits(CGraph* pGraph) {
        m_pGraph = pGraph;
    }
    void SetGraph(CGraph* pGraph) {
        Clear();
        m_pGraph = pGraph;
    }

    bool MemberP(CVertex* pVertex);
    void Add(CVertex* pVertex) { m_Vertices.push_back(pVertex); }
    void Delete(CVertex* pVertex);
    size_t GetNVertices() { return m_Vertices.size(); }
    void Clear() { m_Vertices.clear(); }
    void Save(const char* filename);
    void Load(const char* filename);
    void RandomCreation(int nVisits, bool ciclo);
};

ostream& operator<< (ostream& s, const CVisits& visits);


// =============================================================================
// CTrack ======================================================================
// =============================================================================

class CTrack {
public:
    list<CEdge*> m_Edges;
    CGraph* m_pGraph;
    //CTrack() { m_pGraph = NULL; }
    CTrack(CGraph* pGraph) {
        m_pGraph = pGraph;
    }
    void SetGraph(CGraph* pGraph) {
        Clear();
        m_pGraph = pGraph;

    }
    CTrack(const CTrack& t) : m_pGraph(t.m_pGraph), m_Edges(t.m_Edges) {}
    CTrack operator=(const CTrack& t) {
        m_pGraph = t.m_pGraph;
        m_Edges = t.m_Edges;
        return *this;
    }
    void AddFirst(CEdge* pEdge) {
        m_Edges.push_front(pEdge);
    }
    void AddLast(CEdge* pEdge) {
        m_Edges.push_back(pEdge);
    }
    void Delete(CVertex* pVertex);
    void Delete(CEdge* pEdge);
    void Clear() {
        m_Edges.clear();
    }
    void AppendBefore(CTrack& t);
    void Append(CTrack& t);
    size_t GetNEdges() { return m_Edges.size(); }


    // Files ----------------------------------------------------------------
    void Save(const char* filename);
    void Load(const char* filename);

    // Length -------------------------------------------------------------------
    double Length();

    bool MemberP(CEdge* pE);
    bool MemberP(CVertex* pV);
};

ostream& operator<< (ostream& s, const CTrack& track);



// =============================================================================
// ALGORITHMS ==================================================================
// =============================================================================

extern int SolutionNodesCreated;
extern int SolutionNodesBranched;

void Dijkstra(CGraph& g, CVertex* pStart);
void DijkstraQueue(CGraph& g, CVertex* pStart);

CTrack SalesmanTrackGreedy(CGraph& g, CVisits& visits);

CTrack SalesmanTrackBacktracking(CGraph& g, CVisits& visits);
CTrack SalesmanTrackBacktrackingGreedy(CGraph& g, CVisits& visits);

CTrack SalesmanTrackBranchAndBound1(CGraph& g, CVisits& visits);

CTrack SalesmanTrackBranchAndBound(CGraph& g, CVisits& visits);

CTrack SalesmanTrackProbabilistic(CGraph& g, CVisits& visits);

CTrack TrobaCami1(CGraph& g);
CTrack TrobaCami2(CGraph& g);
CTrack TrobaCami3(CGraph& g);
CTrack TrobaCamiBranchAndBound(CGraph& g);
CTrack TrobaCamiBranchAndBoundLink(CGraph& g);
CTrack TrobaCamiBranchAndBoundLink2(CGraph& g);

